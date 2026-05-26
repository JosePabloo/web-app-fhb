// FILE: src/features/auth/utils/phoneUtils.ts
// PURPOSE: Phone number validation, cleaning, and E.164 formatting for Firebase Phone Auth.
// NOTES: Used in LoginWithWebAuthn for OTP authentication flow; validates US phone numbers.

/**
 * Cleans a phone number by removing all non-digit characters except + at the start.
 * @param phone - Raw phone input from user
 * @returns Cleaned phone string with only digits and optional leading +
 */
export function cleanPhoneNumber(phone: string): string {
  // Remove all non-digit characters except leading +
  if (phone.startsWith('+')) {
    return '+' + phone.slice(1).replace(/\D/g, '');
  }
  return phone.replace(/\D/g, '');
}

/**
 * Converts a US phone number to E.164 format (+1XXXXXXXXXX).
 * @param phone - Raw or partially formatted phone number
 * @returns E.164 formatted phone number
 * @throws Error if phone number is invalid
 */
export function formatToE164(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  // Already in E.164 format
  if (cleaned.startsWith('+')) {
    if (cleaned.length >= 12 && cleaned.startsWith('+1')) {
      return cleaned;
    }
    // Handle international numbers without country code - assume US
    return `+1${cleaned.slice(1)}`;
  }
  
  // US number without + prefix
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  throw new Error('Invalid phone number format');
}

/**
 * Validates that a phone number looks reasonable for US SMS delivery.
 * @param phone - Phone number to validate
 * @returns true if phone number appears valid
 */
export function isValidUSPhone(phone: string): boolean {
  try {
    const e164 = formatToE164(phone);
    // E.164 US number should be +1 followed by 10 digits
    const digits = e164.replace(/\D/g, '');
    return digits.length === 11 && digits.startsWith('1');
  } catch {
    return false;
  }
}

/**
 * Extracts the phone number from an E.164 formatted string for display.
 * @param e164Phone - E.164 formatted phone number
 * @returns Formatted display string (e.g., "(555) 123-4567")
 */
export function formatForDisplay(e164Phone: string): string {
  const digits = e164Phone.replace(/\D/g, '');
  
  if (digits.length === 11 && digits.startsWith('1')) {
    const number = digits.slice(1);
    const area = number.slice(0, 3);
    const prefix = number.slice(3, 6);
    const line = number.slice(6, 10);
    return `(${area}) ${prefix}-${line}`;
  }
  
  return e164Phone;
}
