import type { Verified } from '@/config/site';

export function isVerifiedFact<T>(
  fact: Verified<T>
): fact is Verified<T> & { status: 'verified'; value: T } {
  return fact.status === 'verified' && fact.value !== null;
}

export function factText<T>(fact: Verified<T>, formatter?: (value: T) => string): string {
  if (isVerifiedFact(fact)) {
    return formatter ? formatter(fact.value) : String(fact.value);
  }
  return 'Not yet publicly verified';
}

export function isFactObject(value: unknown): value is Verified<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    ((value as Record<string, unknown>).status === 'verified' ||
      (value as Record<string, unknown>).status === 'unverified')
  );
}

/**
 * Single source of truth for download CTA copy across the header, hero, and
 * status panel — so no section can say "Download" while another still says
 * unverified. Swap this, not the copy in individual components.
 */
export function downloadCtaLabel(downloadUrl: Verified<string>): string {
  return isVerifiedFact(downloadUrl) ? 'Download Pak Rummy' : 'Check Download Status';
}

export type StatusTone = 'verified' | 'pending' | 'unavailable';

export function factStatusTone(fact: Verified<unknown>): StatusTone {
  return isVerifiedFact(fact) ? 'verified' : 'pending';
}
