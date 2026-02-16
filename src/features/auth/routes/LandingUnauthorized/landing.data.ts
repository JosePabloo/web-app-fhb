// FILE: src/features/auth/routes/LandingUnauthorized/landing.data.ts
// PURPOSE: Content model for public landing navigation and project showcase items.
// NOTES: Keeps copy and media references separate from section layout implementation.

import homeImage from '../../../../assets/home.png';
import bathroomImage from '../../../../assets/bathroom.png';
import hoodieImage from '../../../../assets/hoodie.jpg';
import cityNightImage from '../../../../assets/city-night.jpg';

export type ProjectId = 'lakeside-exterior' | 'primary-suite' | 'utility-entry';

export type LandingProject = {
  id: ProjectId;
  title: string;
  category: string;
  body: string;
  image: string;
  alt: string;
};

export type LandingImagePayload = {
  heroBackgroundImage?: string;
  projectImages?: Partial<Record<ProjectId, string>>;
};

export const heroBackgroundImage = cityNightImage;

export const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Recent work', href: '#recent-work' },
  { label: 'About us', href: '#about' },
] as const;

export const projects: LandingProject[] = [
  {
    id: 'lakeside-exterior',
    title: 'Lakeside Exterior Rebuild',
    category: 'Exterior construction',
    body: 'Envelope redesign with cold-weather materials and long-cycle durability planning.',
    image: homeImage,
    alt: 'Frost Haven exterior project',
  },
  {
    id: 'primary-suite',
    title: 'Primary Suite Renovation',
    category: 'Interior remodel',
    body: 'Architectural reconfiguration focused on comfort, efficiency, and timeless finishes.',
    image: bathroomImage,
    alt: 'Frost Haven interior project',
  },
  {
    id: 'utility-entry',
    title: 'Crafted Utility Entry',
    category: 'Custom detail build',
    body: 'High-traffic transition space engineered for winter use and daily resilience.',
    image: hoodieImage,
    alt: 'Frost Haven custom project detail',
  },
];
