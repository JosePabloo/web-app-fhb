// FILE: src/shared/utils/date.ts
// PURPOSE: Centralized date utilities used across features to format ISO strings safely.
// NOTES: Returns an em dash (—) for empty/invalid inputs; uses toLocaleDateString for display.

export function formatIsoDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return d.toLocaleDateString();
  } catch {
    return '—';
  }
}
