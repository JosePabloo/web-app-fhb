// FILE: src/features/auth/routes/Contact/contact.data.ts
// PURPOSE: Holds contact-page copy, options, and validation logic separate from layout implementation.
// NOTES: Keeps route sections presentation-focused and makes content updates low-risk.

export type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  projectAddress: string;
  investmentRange: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Recent work', to: '/#recent-work' },
] as const;

export const contactCopy = {
  brand: 'Frost Haven Builders',
  heading: 'Start Your Project.',
  subtext: "Tell us about your home and we'll schedule a consultation.",
  location: 'Minneapolis, Minnesota',
  appointmentLine: 'Consultations by appointment',
} as const;

export const projectTypeOptions = ['Interior Remodel', 'Exterior Construction', 'Full Project', 'Not Sure Yet'] as const;

export const investmentRangeOptions = ['$250k-$500k', '$500k-$1M', '$1M+'] as const;

export const initialValues: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  projectType: '',
  projectAddress: '',
  investmentRange: '',
  message: '',
};

export const submitDelayMs = 700;

export function validateContactForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.investmentRange.trim()) {
    errors.investmentRange = 'Estimated investment range is required.';
  }

  if (!values.message.trim()) {
    errors.message = 'Project details are required.';
  }

  return errors;
}
