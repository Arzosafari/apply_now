import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { config } from '../config';
import { db, nowIso } from '../db';
import { HttpError, asyncHandler, validationError } from '../lib/http';
import {
  createStripeCheckout,
  getSafePaymentStatus,
  retrieveStripeCheckout,
  syncPaymentFromSession,
  verifyStripeSignature,
} from '../lib/payments';

export const paymentRouter = Router();

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many payment attempts. Please wait before trying again.',
    code: 'RATE_LIMITED',
  },
});

const checkoutSchema = z.object({
  consultationReference: z.string().trim().min(6).max(40),
  packageId: z.number().int().positive(),
});

paymentRouter.post(
  '/checkout',
  checkoutLimiter,
  asyncHandler(async (req, res) => {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    if (!config.stripe.enabled) {
      throw new HttpError(
        503,
        'Online payments are not configured yet. Your consultation request is saved and our team can confirm payment instructions.',
        'PAYMENTS_NOT_CONFIGURED',
      );
    }

    const consultation = db
      .prepare('SELECT * FROM consultations WHERE reference = ?')
      .get(parsed.data.consultationReference) as
      | { id: number; reference: string; email: string; full_name: string; status: string }
      | undefined;
    if (!consultation) {
      throw new HttpError(404, 'Consultation request not found.', 'NOT_FOUND');
    }
    const pkg = db
      .prepare('SELECT * FROM packages WHERE id = ? AND visible = 1 AND cta_type = ?')
      .get(parsed.data.packageId, 'payment') as
      | {
          id: number;
          name_en: string;
          description_en: string;
          price_minor: number;
          currency: string;
        }
      | undefined;
    if (!pkg) throw new HttpError(404, 'This package is not available for online payment.', 'NOT_FOUND');
    if (pkg.price_minor < 50) {
      throw new HttpError(400, 'This package does not require online payment.', 'INVALID_AMOUNT');
    }
    const alreadyPaid = db
      .prepare(
        `SELECT id FROM payments
         WHERE consultation_id = ? AND package_id = ? AND status = 'successful' LIMIT 1`,
      )
      .get(consultation.id, pkg.id);
    if (alreadyPaid) {
      throw new HttpError(409, 'This package is already paid for this consultation request.', 'ALREADY_PAID');
    }

    const year = new Date().getFullYear();
    const reference = `PAY-${year}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
    const now = nowIso();
    const paymentId = Number(
      db
        .prepare(
          `INSERT INTO payments
           (reference, consultation_id, package_id, provider, amount_minor, currency, status, description,
            customer_email, metadata, created_at, updated_at)
           VALUES (?, ?, ?, 'stripe', ?, ?, 'pending', ?, ?, '{}', ?, ?)`,
        )
        .run(
          reference,
          consultation.id,
          pkg.id,
          pkg.price_minor,
          pkg.currency.toUpperCase(),
          `${pkg.name_en} — FaraTech`,
          consultation.email,
          now,
          now,
        ).lastInsertRowid,
    );

    try {
      const session = await createStripeCheckout({
        paymentReference: reference,
        packageName: pkg.name_en,
        description: pkg.description_en,
        amountMinor: pkg.price_minor,
        currency: pkg.currency,
        customerEmail: consultation.email,
      });
      db.prepare(
        `UPDATE payments SET provider_checkout_id = ?, metadata = ?, updated_at = ? WHERE id = ?`,
      ).run(
        session.id,
        JSON.stringify({ stripe_session: session.id, consultation_reference: consultation.reference }),
        nowIso(),
        paymentId,
      );
      res.status(201).json({
        checkoutUrl: session.url,
        reference,
        amountMinor: pkg.price_minor,
        currency: pkg.currency.toUpperCase(),
      });
    } catch (error) {
      db.prepare(
        `UPDATE payments SET status = 'failed', metadata = ?, updated_at = ? WHERE id = ?`,
      ).run(
        JSON.stringify({
          reason: error instanceof HttpError ? error.code : 'checkout_creation_failed',
        }),
        nowIso(),
        paymentId,
      );
      throw error;
    }
  }),
);

paymentRouter.get(
  '/status',
  asyncHandler(async (req, res) => {
    const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : '';
    if (!sessionId) throw new HttpError(400, 'Checkout reference is missing.', 'VALIDATION_ERROR');
    const session = await retrieveStripeCheckout(sessionId);
    if (session.payment_status === 'paid') {
      syncPaymentFromSession(session);
    }
    res.json(getSafePaymentStatus(session));
  }),
);

export async function stripeWebhookHandler(req: import('express').Request, res: import('express').Response) {
  try {
    const signature = req.get('stripe-signature');
    const payload = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
    verifyStripeSignature(payload, signature);
    const event = JSON.parse(payload.toString('utf8')) as {
      type: string;
      data: { object: Record<string, unknown> };
    };
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded' ||
      event.type === 'checkout.session.expired'
    ) {
      syncPaymentFromSession(event.data.object as never);
    }
    res.json({ received: true });
  } catch (error) {
    console.error('[stripe webhook]', error instanceof Error ? error.message : error);
    res.status(error instanceof HttpError ? error.status : 400).json({ error: 'Webhook rejected.' });
  }
}
