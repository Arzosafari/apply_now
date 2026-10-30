import crypto from 'node:crypto';
import { config } from '../config';
import { db, nowIso } from '../db';
import { HttpError, logActivity } from './http';

interface StripeSession {
  id: string;
  object: string;
  amount_total: number | null;
  currency: string | null;
  payment_status: string;
  status: string | null;
  client_reference_id: string | null;
  payment_intent: string | null;
  url?: string | null;
  metadata?: Record<string, string>;
  receipt_email?: string | null;
  customer_details?: { email?: string | null } | null;
}

const STRIPE_API = 'https://api.stripe.com/v1';

function requireStripe() {
  if (!config.stripe.secretKey) {
    throw new HttpError(
      503,
      'Online payments are not configured yet. Please submit a consultation request and our team will confirm payment instructions.',
      'PAYMENTS_NOT_CONFIGURED',
    );
  }
}

async function stripeRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  requireStripe();
  const response = await fetch(`${STRIPE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.stripe.secretKey}`,
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(20000),
  });
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string; type?: string };
  };
  if (!response.ok) {
    console.error('[stripe] API error', response.status, data?.error?.type);
    throw new HttpError(
      502,
      'The payment provider could not start checkout. Please try again later or contact us.',
      'PAYMENT_PROVIDER_ERROR',
    );
  }
  return data;
}

export async function createStripeCheckout(input: {
  paymentReference: string;
  packageName: string;
  description: string;
  amountMinor: number;
  currency: string;
  customerEmail: string;
}) {
  if (input.amountMinor < 50) {
    throw new HttpError(400, 'This package cannot be paid online. Please request a consultation.', 'INVALID_AMOUNT');
  }
  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('success_url', config.stripe.successUrl);
  form.set('cancel_url', config.stripe.cancelUrl);
  form.set('client_reference_id', input.paymentReference);
  form.set('customer_email', input.customerEmail);
  form.set('line_items[0][quantity]', '1');
  form.set('line_items[0][price_data][currency]', input.currency.toLowerCase());
  form.set('line_items[0][price_data][unit_amount]', String(input.amountMinor));
  form.set('line_items[0][price_data][product_data][name]', input.packageName.slice(0, 120));
  form.set(
    'line_items[0][price_data][product_data][description]',
    input.description.slice(0, 300) || 'FaraTech professional service package',
  );
  form.set('metadata[payment_reference]', input.paymentReference);
  form.set('payment_intent_data[metadata][payment_reference]', input.paymentReference);
  form.set('allow_promotion_codes', 'false');
  form.set('billing_address_collection', 'auto');

  const session = await stripeRequest<StripeSession>('/checkout/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!session.url) {
    throw new HttpError(502, 'The payment provider did not return a checkout page.', 'PAYMENT_PROVIDER_ERROR');
  }
  return session;
}

export async function retrieveStripeCheckout(sessionId: string) {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    throw new HttpError(400, 'Invalid checkout reference.', 'INVALID_SESSION');
  }
  return stripeRequest<StripeSession>(`/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
  });
}

export function verifyStripeSignature(payload: Buffer, signatureHeader: string | undefined) {
  const secret = config.stripe.webhookSecret;
  if (!secret) {
    throw new HttpError(503, 'Payment webhook is not configured.', 'WEBHOOK_NOT_CONFIGURED');
  }
  if (!signatureHeader) {
    throw new HttpError(400, 'Missing webhook signature.', 'INVALID_SIGNATURE');
  }
  const parts = signatureHeader.split(',').reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split('=');
    if (!key || !value) return acc;
    acc[key] = [...(acc[key] || []), value];
    return acc;
  }, {});
  const timestamp = Number(parts.t?.[0]);
  const signatures = parts.v1 || [];
  if (!timestamp || signatures.length === 0) {
    throw new HttpError(400, 'Malformed webhook signature.', 'INVALID_SIGNATURE');
  }
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300) {
    throw new HttpError(400, 'Webhook timestamp is outside the allowed window.', 'INVALID_SIGNATURE');
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload.toString('utf8')}`)
    .digest('hex');
  const valid = signatures.some((signature) => {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
  if (!valid) {
    throw new HttpError(400, 'Webhook signature verification failed.', 'INVALID_SIGNATURE');
  }
}

export function syncPaymentFromSession(session: StripeSession) {
  const reference =
    session.client_reference_id || session.metadata?.payment_reference || null;
  if (!reference) {
    console.warn('[payments] Stripe session has no payment reference', session.id);
    return { updated: false, reference: null };
  }
  const payment = db
    .prepare('SELECT * FROM payments WHERE reference = ?')
    .get(reference) as
    | {
        id: number;
        status: string;
        amount_minor: number;
        currency: string;
        consultation_id: number | null;
      }
    | undefined;
  if (!payment) {
    console.warn('[payments] Unknown payment reference from Stripe', reference);
    return { updated: false, reference };
  }

  if (payment.status === 'successful' || payment.status === 'refunded') {
    return { updated: false, reference };
  }

  if (session.payment_status === 'paid') {
    if (
      session.amount_total !== payment.amount_minor ||
      (session.currency || '').toUpperCase() !== payment.currency.toUpperCase()
    ) {
      db.prepare(
        `UPDATE payments SET status = 'failed', metadata = ?, updated_at = ? WHERE id = ?`,
      ).run(
        JSON.stringify({
          reason: 'Amount or currency mismatch during verification',
          session_amount: session.amount_total,
          session_currency: session.currency,
        }),
        nowIso(),
        payment.id,
      );
      console.error('[payments] Amount mismatch for', reference);
      return { updated: true, reference };
    }
    db.prepare(
      `UPDATE payments
       SET status = 'successful', provider_payment_id = ?, receipt_url = ?, paid_at = ?,
           customer_email = COALESCE(customer_email, ?), metadata = ?, updated_at = ?
       WHERE id = ? AND status = 'pending'`,
    ).run(
      session.payment_intent ?? null,
      null,
      nowIso(),
      session.customer_details?.email ?? session.receipt_email ?? null,
      JSON.stringify({ stripe_session: session.id, payment_status: session.payment_status }),
      nowIso(),
      payment.id,
    );
    logActivity({
      action: 'payment_verified',
      entityType: 'payment',
      entityId: payment.id,
      details: { reference, provider: 'stripe', session: session.id },
    });
    return { updated: true, reference };
  }

  if (session.status === 'expired') {
    db.prepare(
      `UPDATE payments SET status = 'cancelled', metadata = ?, updated_at = ? WHERE id = ? AND status = 'pending'`,
    ).run(JSON.stringify({ reason: 'Checkout expired', stripe_session: session.id }), nowIso(), payment.id);
    return { updated: true, reference };
  }

  return { updated: false, reference };
}

export function getSafePaymentStatus(session: StripeSession) {
  const reference = session.client_reference_id || session.metadata?.payment_reference;
  const payment = reference
    ? (db
        .prepare(
          `SELECT p.reference, p.status, p.amount_minor, p.currency, p.description,
                  pk.name_en AS package_name_en, pk.name_fa AS package_name_fa
           FROM payments p LEFT JOIN packages pk ON pk.id = p.package_id
           WHERE p.reference = ?`,
        )
        .get(reference) as Record<string, unknown> | undefined)
    : undefined;
  return {
    reference: reference || null,
    paymentStatus: session.payment_status,
    sessionStatus: session.status,
    amountMinor: session.amount_total,
    currency: session.currency?.toUpperCase() || null,
    packageName: payment?.package_name_en || null,
    packageNameFa: payment?.package_name_fa || null,
    recordStatus: payment?.status || null,
    description: payment?.description || null,
  };
}
