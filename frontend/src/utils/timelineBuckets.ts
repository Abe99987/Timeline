import type { TimelineEvent } from "@/data/sampleEvents";

/**
 * Get the representative year for an event (midpoint of its range)
 */
export function getRepresentativeYear(event: TimelineEvent): number {
  return Math.round((event.yearStart + event.yearEnd) / 2);
}

/**
 * Group events by their representative year
 */
export function groupEventsByYear(
  events: TimelineEvent[],
): Map<number, TimelineEvent[]> {
  const buckets = new Map<number, TimelineEvent[]>();

  for (const event of events) {
    const year = getRepresentativeYear(event);
    const existing = buckets.get(year) ?? [];
    existing.push(event);
    buckets.set(year, existing);
  }

  return buckets;
}

/**
 * Generate an array of years from minYear to maxYear (inclusive)
 */
export function generateYearRange(minYear: number, maxYear: number): number[] {
  const years: number[] = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year);
  }
  return years;
}

/**
 * Find the best event for a given focus year from a bucket map
 */
export function getBestEventForFocusYear(
  buckets: Map<number, TimelineEvent[]>,
  focusYear: number,
  searchRadius: number = 5,
): TimelineEvent | null {
  // First check exact match
  const exactMatch = buckets.get(focusYear);
  if (exactMatch && exactMatch.length > 0) {
    return exactMatch[0];
  }

  // Search nearby years within radius
  for (let offset = 1; offset <= searchRadius; offset++) {
    const before = buckets.get(focusYear - offset);
    if (before && before.length > 0) {
      return before[0];
    }
    const after = buckets.get(focusYear + offset);
    if (after && after.length > 0) {
      return after[0];
    }
  }

  return null;
}

