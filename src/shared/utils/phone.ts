// FILE: src/shared/utils/phone.ts
// PURPOSE: Normalizes phone input to E.164 and formats to human-readable US style for display.
// NOTES: Used in login and settings flows; throws on invalid numbers to surface validation errors early.

export function formatPhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, '');

  if (digits.startsWith('1') && digits.length === 11) {
    return `+${digits}`;
  } else if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.startsWith('+') || digits.length > 11) {
    return `+${digits}`;
  }

  throw new Error('Invalid phone number');
}

export function formatPhoneNumberIntoEnglish(input: string): string | null {
  const digitsOnly = formatPhoneNumber(input).replace(/\D/g, '');

  let core = digitsOnly;
  if (core.length === 11 && core.startsWith('1')) {
    core = core.slice(1);
  }

  if (core.length !== 10) {
    return null;
  }

  const area = core.slice(0, 3);
  const prefix = core.slice(3, 6);
  const line = core.slice(6, 10);

  return `(${area}) ${prefix}-${line}`;
}
