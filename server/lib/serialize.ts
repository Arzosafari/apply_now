import { parseJson } from '../db';

const JSON_COLUMNS = new Set([
  'eligibility_en',
  'eligibility_fa',
  'documents_en',
  'documents_fa',
  'process_en',
  'process_fa',
  'benefits_en',
  'benefits_fa',
  'faqs_en',
  'faqs_fa',
  'universities_en',
  'universities_fa',
  'study_pathways_en',
  'study_pathways_fa',
  'work_pathways_en',
  'work_pathways_fa',
  'pr_pathways_en',
  'pr_pathways_fa',
  'family_pathways_en',
  'family_pathways_fa',
  'investment_pathways_en',
  'investment_pathways_fa',
  'highlights_en',
  'highlights_fa',
  'features_en',
  'features_fa',
  'exclusions_en',
  'exclusions_fa',
  'languages_en',
  'languages_fa',
  'metadata',
  'details',
]);

const BOOLEAN_COLUMNS = new Set([
  'featured',
  'published',
  'visible',
  'is_demo',
  'privacy_consent',
  'is_active',
]);

export function serializeRow<T = Record<string, unknown>>(row: unknown): T {
  if (!row || typeof row !== 'object') return row as T;
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
    if (JSON_COLUMNS.has(key)) {
      output[key] = parseJson(value, []);
    } else if (BOOLEAN_COLUMNS.has(key)) {
      output[key] = value === 1 || value === true;
    } else {
      output[key] = value;
    }
  }
  return output as T;
}

export function serializeRows<T = Record<string, unknown>>(rows: unknown[]): T[] {
  return rows.map((row) => serializeRow<T>(row));
}

export function serializeSetting(value: unknown) {
  return parseJson(value, null);
}

export function formatMoney(minor: number, currency: string, locale = 'en') {
  const amount = minor / 100;
  const currencyCode = currency || 'USD';
  try {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}`;
  }
}
