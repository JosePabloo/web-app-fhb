// FILE: src/features/auth/routes/Contact/index.test.tsx
// PURPOSE: Validate contact-form rendering and required-field validation behavior for the public CTA destination.
// NOTES: Uses RTL + user-event to verify user-visible error messages on invalid submission.

import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './index';
import React from 'react';

describe('Contact route', () => {
  it('renders form content', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    expect(screen.getByText(/Start Your Project\./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Request Consultation/i })[0]).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    await user.click(screen.getAllByRole('button', { name: /Request Consultation/i })[0]);

    expect(screen.getByText(/Full name is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated investment range is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Project details are required\./i)).toBeInTheDocument();
  });
});
