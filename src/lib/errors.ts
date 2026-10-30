import { ApiError } from './api';
import type { Locale } from '@shared/types';

const messages: Record<string, { en: string; fa: string }> = {
  PAYMENTS_NOT_CONFIGURED: {
    en: 'Online payment is not configured yet. Please contact the team to complete payment.',
    fa: 'پرداخت آنلاین هنوز پیکربندی نشده است. برای تکمیل پرداخت با تیم تماس بگیرید.',
  },
  ALREADY_PAID: {
    en: 'This package has already been paid for this request.',
    fa: 'هزینه این بسته برای این درخواست قبلاً پرداخت شده است.',
  },
  RATE_LIMITED: {
    en: 'Too many attempts. Please wait a little and try again.',
    fa: 'تلاش‌های بیش از حد. لطفاً کمی صبر کنید و دوباره تلاش کنید.',
  },
  VALIDATION_ERROR: {
    en: 'Please review the highlighted fields.',
    fa: 'لطفاً فیلدهای مشخص‌شده را بررسی کنید.',
  },
  UNAUTHENTICATED: {
    en: 'Your session has expired. Please sign in again.',
    fa: 'نشست شما منقضی شده است. دوباره وارد شوید.',
  },
  INVALID_CREDENTIALS: {
    en: 'Email or password is incorrect.',
    fa: 'ایمیل یا رمز عبور نادرست است.',
  },
  CSRF_REJECTED: {
    en: 'Security token expired. Refresh the page and try again.',
    fa: 'توکن امنیتی منقضی شده است. صفحه را تازه کنید و دوباره تلاش کنید.',
  },
  INTERNAL_ERROR: {
    en: 'Something went wrong on our side. Please try again.',
    fa: 'مشکلی از سمت ما پیش آمد. دوباره تلاش کنید.',
  },
};

export function errorMessage(error: unknown, locale: Locale) {
  if (error instanceof ApiError) {
    const translated = messages[error.code]?.[locale];
    if (translated) return translated;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return locale === 'fa' ? 'مشکلی پیش آمد. دوباره تلاش کنید.' : 'Something went wrong. Please try again.';
}
