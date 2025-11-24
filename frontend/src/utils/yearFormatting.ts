export function formatYearLabel(year: number): string {
  if (year === 0) {
    return "0";
  }

  const suffix = year < 0 ? "BCE" : "CE";
  return `${Math.abs(year)} ${suffix}`;
}

export function formatYearRange(start: number, end: number): string {
  if (start === end) {
    return formatYearLabel(start);
  }

  const sameEra =
    (start <= 0 && end <= 0) || (start >= 0 && end >= 0) || end === 0;

  if (sameEra) {
    const suffix = end < 0 || (end === 0 && start < 0) ? "BCE" : "CE";
    return `${Math.abs(start)}–${Math.abs(end)} ${suffix}`;
  }

  return `${formatYearLabel(start)} – ${formatYearLabel(end)}`;
}

export function clampYear(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getEraAnchor(year: number, step: number): number {
  if (step <= 0) {
    return year;
  }

  const normalizedStep = Math.max(1, step);
  const anchor = Math.floor(year / normalizedStep) * normalizedStep;
  return anchor;
}


