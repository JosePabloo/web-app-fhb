// FILE: src/features/auth/routes/Contact/index.tsx
// PURPOSE: Thin route composition for the public consultation intake page.
// NOTES: Delegates copy, styling tokens, and section rendering to modular Contact route files.

import { Box, Container } from '@mui/material';
import { layout, sectionContainer, space } from './contact.theme';
import ContactIntro from './sections/ContactIntro';
import ContactNav from './sections/ContactNav';
import ConsultationForm from './sections/ConsultationForm';

export default function Contact() {
  return (
    <Box sx={layout.page}>
      <Container
        maxWidth={false}
        sx={{
          ...sectionContainer,
          pt: space.page.pt,
          pb: space.page.pb,
        }}
      >
        <ContactNav />
        <Box
          sx={{
            display: 'grid',
            gap: space.content.gap,
            gridTemplateColumns: space.content.columns,
            alignItems: 'start',
          }}
        >
          <ContactIntro />
          <ConsultationForm />
        </Box>
      </Container>
    </Box>
  );
}
