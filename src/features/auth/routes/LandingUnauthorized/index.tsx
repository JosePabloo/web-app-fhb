// FILE: src/features/auth/routes/LandingUnauthorized/index.tsx
// PURPOSE: Public landing screen prompting unauthenticated users to initiate login/onboarding.
// NOTES: Served under PublicLayout before authentication; uses PageWrapper for consistent vertical centering and recaptcha anchor.

/*
Iteration Notes (do not remove):
1) Tall hero with heavy gradient + centered CTA; grid overlay felt too loud, toned down blueprint lines and tightened spacing.
2) Split hero (text left, stats right) with card stack; looked busy and broke the minimal ask—dropped stacked cards.
3) Full-bleed ridge line SVG animation; kept motion but simplified to a subtle shimmer border under hero for performance.
4) Minimal monochrome with only text; too stark and lacked the “premium craft” feel. Reintroduced ice accent and micro-motions.
5) Final v1: layered hero with blueprint grid + ridge highlight, sticky bar, sectional rhythm (services, philosophy, process, proof).
6) Final v2 (current): keeps the hero + shimmer line, adds angled section breaks, offset cards, and “maker’s ledger” copy to push a more experimental but premium feel.
*/

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../../../assets/frosthaven.png';
import bathroomImage from '../../../../assets/bathroom.png';
import homeImage from '../../../../assets/home.png';
import hoodieImage from '../../../../assets/hoodie.jpg';
import heroVideo from '../../../../assets/video.mp4';

const palette = {
  charcoal: '#0f172a',
  graphite: '#111827',
  frost: '#dce9f7',
  ice: '#6fb1ff',
  mist: 'rgba(255,255,255,0.06)',
};

const sectionsPadding = { py: { xs: 7, md: 9 } };
const SHOP_URL =
  'https://frost-haven-builders.myshopify.com/checkouts/cn/hWN7C71IYEMyMY9eWTAN2X8j/en-us?_r=AQABIa1_wZfHKB_E1__RjL6COKiDftTGtxvMGO7l6i0dVVE';

const typography = {
  display: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif',
  body: '"Work Sans", "Avenir Next", "Segoe UI", sans-serif',
};

function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        color: '#fff',
        overflow: 'hidden',
        background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 25%), radial-gradient(circle at 80% 10%, rgba(111,177,255,0.25), transparent 35%), linear-gradient(135deg, ${palette.charcoal} 0%, ${palette.graphite} 70%)`,
        pb: { xs: 10, md: 12 },
        pt: { xs: 14, md: 16 },
      }}
    >
      <HeroOrbs />
      <BlueprintOverlay />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} sx={{ animation: 'pageIn 0.8s ease-out both', '@keyframes pageIn': { '0%': { opacity: 0 }, '100%': { opacity: 1 } } }}>
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              alignItems: 'center',
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box component="img" src={logo} alt="Frost Haven Builders logo" sx={{ height: 26, width: 'auto' }} />
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 3, color: palette.frost, fontFamily: typography.body }}
                >
                  Frost Haven Builders
                </Typography>
              </Stack>
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 4,
                  color: palette.ice,
                  fontFamily: typography.body,
                  textTransform: 'uppercase',
                }}
              >
                From Blueprint to Build
              </Typography>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.02,
                  fontFamily: typography.display,
                  fontSize: { xs: '2.6rem', md: '3.8rem' },
                  animation: 'rise 1s ease-out both',
                  '@keyframes rise': {
                    '0%': { opacity: 0, transform: 'translateY(16px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                Discover the perfect interior solutions for every room.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  maxWidth: 620,
                  fontFamily: typography.body,
                  fontSize: { xs: '1rem', md: '1.05rem' },
                }}
              >
                Enhance your property&apos;s appearance with expert exterior construction services.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  sx={{
                    px: 3,
                    py: 1.4,
                    fontWeight: 600,
                    backgroundColor: palette.ice,
                    color: palette.charcoal,
                    textTransform: 'none',
                    fontFamily: typography.body,
                    '&:hover': { backgroundColor: '#5a9ee8' },
                  }}
                >
                  Let&apos;s build your dream now
                </Button>
                <Button
                  variant="text"
                  component="a"
                  href={SHOP_URL}
                  sx={{
                    color: palette.frost,
                    textDecoration: 'underline',
                    textTransform: 'none',
                    fontFamily: typography.body,
                  }}
                >
                  Shop now
                </Button>
              </Stack>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {['Interior remodels', 'Exterior upgrades', 'Crew gear'].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      border: `1px solid ${palette.mist}`,
                      borderRadius: 999,
                      px: 2,
                      py: 0.6,
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.75)',
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      fontFamily: typography.body,
                      background: 'rgba(15,23,42,0.6)',
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>
            </Stack>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${palette.mist}`,
                minHeight: { xs: 240, md: 360 },
                boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
                animation: 'softFloat 6s ease-in-out infinite',
                '@keyframes softFloat': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-8px)' },
                  '100%': { transform: 'translateY(0px)' },
                },
              }}
            >
              <Box
                component="video"
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(120deg, rgba(15,23,42,0.6), rgba(15,23,42,0))',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 16,
                  bottom: 16,
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  background: 'rgba(15,23,42,0.75)',
                  border: `1px solid ${palette.mist}`,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <Typography variant="body2" sx={{ color: palette.frost, fontFamily: typography.body }}>
                  Minnesota-built craftsmanship
                </Typography>
              </Box>
            </Box>
          </Box>
          <SignatureLine />
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
            }}
          >
            {[
              { label: 'Specialized projects for every room.', value: 'Interior solutions' },
              { label: 'Expert services that elevate curb appeal.', value: 'Exterior construction' },
              { label: 'Experience apparel designed for strength and style.', value: 'Rugged yet Refined' },
              { label: 'Clothing withstands tough conditions.', value: 'Durability first' },
            ].map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  animation: 'fadeUp 0.8s ease-out both',
                  animationDelay: `${index * 0.12}s`,
                  '@keyframes fadeUp': {
                    '0%': { opacity: 0, transform: 'translateY(12px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Box
                  sx={{
                    border: `1px solid ${palette.mist}`,
                    borderRadius: 2,
                    p: 2.5,
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(6px)',
                    minHeight: 120,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: palette.frost, fontFamily: typography.display }}
                  >
                    {item.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: typography.body }}>
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function ServicesSection() {
  const services = [
    {
      title: 'Interior solutions',
      body: 'Discover the perfect interior solutions for every room with our specialized projects.',
      image: bathroomImage,
      alt: 'Bathroom remodel',
    },
    {
      title: 'Exterior construction',
      body: 'Enhance your property&apos;s appearance with expert exterior construction services.',
      image: homeImage,
      alt: 'Home exterior remodel',
    },
  ];

  return (
    <Box sx={{ position: 'relative', background: '#0b1224', ...sectionsPadding }}>
      <SectionBreak />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 16,
            border: `1px solid ${palette.mist}`,
            borderRadius: 3,
            opacity: 0.4,
            pointerEvents: 'none',
            clipPath: 'polygon(0 5%, 95% 0, 100% 95%, 5% 100%)',
          }}
        />
        <SectionHeader
          eyebrow="Introducing"
          title="Discover the perfect interior solutions for every room"
          subtitle="Enhance your property&apos;s appearance with expert exterior construction services."
        />
        <Stack spacing={4} sx={{ mt: 4 }}>
          {services.map((service, index) => (
            <Box
              key={service.title}
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                alignItems: 'center',
                animation: 'fadeSlide 0.9s ease-out both',
                animationDelay: `${index * 0.15}s`,
                '@keyframes fadeSlide': {
                  '0%': { opacity: 0, transform: 'translateY(18px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box
                sx={{
                  order: { xs: 0, md: index % 2 === 0 ? 0 : 1 },
                }}
              >
                <Box
                  component="img"
                  src={service.image}
                  alt={service.alt}
                  sx={{
                    width: '100%',
                    height: { xs: 220, md: 320 },
                    objectFit: 'cover',
                    borderRadius: 3,
                    border: `1px solid ${palette.mist}`,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                    transition: 'transform 0.6s ease',
                    '&:hover': { transform: 'scale(1.02)' },
                  }}
                />
              </Box>
              <Box
                sx={{
                  border: `1px solid ${palette.mist}`,
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
                  background: 'rgba(15,23,42,0.9)',
                  animation: 'panelFloat 9s ease-in-out infinite',
                  '@keyframes panelFloat': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                    '100%': { transform: 'translateY(0px)' },
                  },
                }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 3, color: palette.ice, fontFamily: typography.body }}>
                  Service focus
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: '#fff', mb: 1, fontFamily: typography.display, fontWeight: 600 }}
                >
                  {service.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)', fontFamily: typography.body }}>
                  {service.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

function PhilosophySection() {
  return (
    <Box sx={{ position: 'relative', background: palette.charcoal, ...sectionsPadding }}>
      <SectionBreak flip />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(111,177,255,0.08), rgba(255,255,255,0)) 0 0 / 50% 100% no-repeat',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
        <SectionHeader
          eyebrow="Rugged yet Refined"
          title="Experience apparel designed for strength and style"
          subtitle="Perfect for every jobsite, made to carry through the day."
        />
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              border: `1px solid ${palette.mist}`,
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              background: 'rgba(15,23,42,0.9)',
              animation: 'panelFloat 9s ease-in-out infinite',
              '@keyframes panelFloat': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-6px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 3, color: palette.ice, fontFamily: typography.body }}>
              Crew gear
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: '#fff', mb: 2, fontFamily: typography.display, fontWeight: 600 }}
            >
              Rugged yet refined staples built for daily wear
            </Typography>
            <Stack spacing={1.5}>
              {[
                'Experience apparel designed for strength and style, perfect for every jobsite.',
                'Clothing withstands tough conditions with a premium feel.',
                'A staple fit built to move from jobsite to off-hours.',
              ].map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: palette.ice,
                      mt: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.76)', fontFamily: typography.body }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
          <Box>
            <Box
              component="img"
              src={hoodieImage}
              alt="Signature logo hoodie"
              sx={{
                width: '100%',
                maxHeight: 360,
                objectFit: 'cover',
                borderRadius: 3,
                border: `1px solid ${palette.mist}`,
                boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                animation: 'imageDrift 10s ease-in-out infinite',
                '@keyframes imageDrift': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(10px)' },
                  '100%': { transform: 'translateY(0px)' },
                },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function ProcessSection() {
  const steps = [
    {
      title: '01 — Built in the cold',
      body: 'In the heart of Minnesota&apos;s relentless winters, we don&apos;t just build structures—we forge legacies.',
    },
    {
      title: '02 — Interior clarity',
      body: 'From seamless interior remodels that transform chaos into custom sanctuaries.',
    },
    {
      title: '03 — Exterior strength',
      body: 'To exterior overhauls that defy the frost and stand unbreakable.',
    },
    {
      title: '04 — Break ground',
      body: 'No job too big, no detail too small. Ready to build your destiny? Let&apos;s break ground.',
    },
  ];

  return (
    <Box sx={{ position: 'relative', background: '#0b1224', ...sectionsPadding }}>
      <SectionBreak />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: { xs: '6%', md: '8%' },
            border: `1px dashed ${palette.mist}`,
            borderRadius: 24,
            opacity: 0.5,
          }}
        />
        <SectionHeader
          eyebrow="From Blueprint to Build"
          title="A story grounded in winter resilience"
          subtitle="From custom sanctuaries to exterior overhauls, Frost Haven turns your blueprint dreams into lived reality."
        />
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.title}
              sx={{
                transform: { md: `translateY(${index % 2 === 0 ? 0 : 14}px)` },
                animation: 'cardIn 0.8s ease-out both',
                animationDelay: `${index * 0.12}s`,
                '@keyframes cardIn': {
                  '0%': { opacity: 0, transform: 'translateY(16px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${palette.mist}`,
                  background: 'linear-gradient(160deg, rgba(111,177,255,0.08), rgba(11,18,36,0.9))',
                  height: '100%',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                }}
              >
                <Typography variant="subtitle1" sx={{ color: palette.ice, fontWeight: 600, fontFamily: typography.body }}>
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.75)', mt: 1.5, fontFamily: typography.body }}
                >
                  {step.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function ProofSection() {
  const proofPoints = [
    'Signature Logo Hoodie — $89.99',
    'Featured products available now',
  ];

  return (
    <Box sx={{ position: 'relative', background: palette.charcoal, ...sectionsPadding }}>
      <SectionBreak flip />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: '-10% 5% auto',
            height: 120,
            background: `radial-gradient(circle at 30% 50%, ${palette.ice}, transparent 45%)`,
            opacity: 0.2,
            filter: 'blur(30px)',
          }}
        />
        <SectionHeader
          eyebrow="Featured products"
          title="Signature Logo Hoodie"
          subtitle="Rugged yet refined staples designed for strength and style."
        />
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
            alignItems: 'center',
          }}
        >
          <Box>
            <Box
              component="img"
              src={hoodieImage}
              alt="Signature logo hoodie"
              sx={{
                width: '100%',
                maxHeight: 340,
                objectFit: 'cover',
                borderRadius: 3,
                border: `1px solid ${palette.mist}`,
                boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                transition: 'transform 0.6s ease',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            />
          </Box>
          <Box
            sx={{
              border: `1px solid ${palette.mist}`,
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              background: 'rgba(15,23,42,0.9)',
              animation: 'panelFloat 9s ease-in-out infinite',
              '@keyframes panelFloat': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-6px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{ letterSpacing: 3, color: palette.ice, fontFamily: typography.body }}
            >
              Limited drop
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: '#fff', mb: 2, fontFamily: typography.display, fontWeight: 600 }}
            >
              Signature Logo Hoodie — $89.99
            </Typography>
            <Stack spacing={1.5}>
              {proofPoints.map((point) => (
                <Stack key={point} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: palette.ice,
                      boxShadow: `0 0 0 6px rgba(111,177,255,0.12)`,
                    }}
                    aria-hidden
                  />
                  <Typography variant="body1" sx={{ color: '#e5e7eb', fontFamily: typography.body }}>
                    {point}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function FooterSection() {
  return (
    <Box
      sx={{
        background: '#0b1224',
        borderTop: `1px solid ${palette.mist}`,
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: '-40% 50% auto',
          width: 280,
          height: 280,
          background: `radial-gradient(circle, rgba(111,177,255,0.2), transparent 60%)`,
          transform: 'rotate(18deg)',
        }}
      />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            alignItems: 'center',
          }}
        >
          <Box>
            <Stack spacing={0.5}>
              <Box
                component="img"
                src={logo}
                alt="Frost Haven Builders logo"
                sx={{ height: 44, width: 'auto' }}
              />
              <Typography variant="h6" sx={{ color: '#fff', fontFamily: typography.display }}>
                Frost Haven Builders
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: typography.body }}>
                Minnesota general contractor · License & insurance on file · Crafted to endure.
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ justifySelf: { xs: 'start', md: 'end' } }}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: palette.mist,
                  textTransform: 'none',
                  fontFamily: typography.body,
                  '&:hover': { borderColor: palette.ice, backgroundColor: 'rgba(111,177,255,0.08)' },
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  backgroundColor: palette.ice,
                  color: palette.charcoal,
                  textTransform: 'none',
                  fontFamily: typography.body,
                  '&:hover': { backgroundColor: '#5a9ee8' },
                }}
              >
                Let&apos;s build your dream now
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function TopBar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(15,23,42,0.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${palette.mist}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box component="img" src={logo} alt="Frost Haven Builders logo" sx={{ height: 36, width: 'auto' }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontFamily: typography.display }}>
            Frost Haven Builders
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            component="a"
            href={SHOP_URL}
            variant="text"
            sx={{ color: palette.frost, textTransform: 'none', fontWeight: 600, fontFamily: typography.body }}
          >
            Shop now
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            sx={{
              backgroundColor: palette.ice,
              color: palette.charcoal,
              fontWeight: 700,
              textTransform: 'none',
              fontFamily: typography.body,
              '&:hover': { backgroundColor: '#5a9ee8' },
            }}
          >
            Login
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack spacing={1.5} sx={{ color: '#fff' }}>
      <Box
        component="img"
        src={logo}
        alt="Frost Haven Builders logo"
        sx={{ height: { xs: 14, md: 16 }, width: 'auto', opacity: 0.75, display: 'block' }}
      />
      <Typography variant="overline" sx={{ letterSpacing: 2, color: palette.ice, fontFamily: typography.body }}>
        {eyebrow}
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 700, fontFamily: typography.display, fontSize: { xs: '1.9rem', md: '2.3rem' } }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)', fontFamily: typography.body }}>
        {subtitle}
      </Typography>
    </Stack>
  );
}

function BlueprintOverlay() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '120px 120px',
        opacity: 0.35,
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))',
      }}
    />
  );
}

function SignatureLine() {
  return (
    <Box sx={{ position: 'relative', height: 18, maxWidth: 420 }}>
      <Divider
        sx={{
          borderColor: palette.mist,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '10%',
          top: -2,
          height: 4,
          width: '30%',
          background: `linear-gradient(90deg, transparent, ${palette.ice}, transparent)`,
          filter: 'blur(1px)',
          animation: 'shimmer 5s ease-in-out infinite',
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-30%) scaleX(0.8)', opacity: 0.8 },
            '50%': { transform: 'translateX(60%) scaleX(1)', opacity: 1 },
            '100%': { transform: 'translateX(-30%) scaleX(0.8)', opacity: 0.8 },
          },
        }}
      />
    </Box>
  );
}

function HeroOrbs() {
  return (
    <>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(111,177,255,0.35), transparent 60%)',
          top: { xs: 40, md: 80 },
          right: { xs: -40, md: 80 },
          filter: 'blur(10px)',
          opacity: 0.7,
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(12px)' },
            '100%': { transform: 'translateY(0px)' },
          },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%)',
          bottom: { xs: 80, md: 120 },
          left: { xs: -60, md: 40 },
          filter: 'blur(6px)',
          opacity: 0.5,
          animation: 'float 10s ease-in-out infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(12px)' },
            '100%': { transform: 'translateY(0px)' },
          },
        }}
      />
    </>
  );
}

function SectionBreak({ flip }: { flip?: boolean }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        background: flip
          ? 'linear-gradient(135deg, rgba(111,177,255,0.08), rgba(15,23,42,0))'
          : 'linear-gradient(315deg, rgba(111,177,255,0.12), rgba(15,23,42,0))',
        clipPath: flip ? 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 75%)',
      }}
    />
  );
}

export default function LandingUnauthorized() {
  return (
    <Box sx={{ backgroundColor: palette.charcoal, color: '#fff' }}>
      <TopBar />
      <HeroSection />
      <ServicesSection />
      <PhilosophySection />
      <ProcessSection />
      <ProofSection />
      <FooterSection />
    </Box>
  );
}
