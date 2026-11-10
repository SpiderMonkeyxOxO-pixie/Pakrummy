import type { Verified } from '@/config/site';

/** Strictly "independently confirmed by us" — excludes operator-stated facts on purpose. */
export function isVerifiedFact<T>(
  fact: Verified<T>
): fact is Verified<T> & { status: 'verified'; value: T } {
  return fact.status === 'verified' && fact.value !== null;
}

export function isOperatorStatedFact<T>(
  fact: Verified<T>
): fact is Verified<T> & { status: 'operator-stated'; value: T } {
  return fact.status === 'operator-stated' && fact.value !== null;
}

/** True for any fact whose value we actually know — verified or operator-stated. */
export function isKnownFact<T>(
  fact: Verified<T>
): fact is Verified<T> & { value: T } {
  return (fact.status === 'verified' || fact.status === 'operator-stated') && fact.value !== null;
}

export function factText<T>(fact: Verified<T>, formatter?: (value: T) => string): string {
  if (isKnownFact(fact)) {
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
      (value as Record<string, unknown>).status === 'operator-stated' ||
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

export type StatusTone = 'verified' | 'operator-stated' | 'pending' | 'unavailable';

export function factStatusTone(fact: Verified<unknown>): StatusTone {
  if (fact.status === 'verified') return 'verified';
  if (fact.status === 'operator-stated') return 'operator-stated';
  return 'pending';
}
