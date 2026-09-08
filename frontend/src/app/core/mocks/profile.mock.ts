import { LegalNotice, Profile } from '../models';

export const mockProfile: Profile = {
  id: 'mock-profile',
  fullName: 'Alexander Mustermann',
  jobTitle: 'Full-Stack Developer',
  bioMarkdown:
    'Ich entwickle digitale Produkte mit einem Fokus auf klare Interfaces, robuste APIs und nachhaltige Architektur.',
  avatarUrl: undefined,
  location: 'Deutschland',
  publicEmail: 'hello@example.com',
  streetAddress: 'Musterstraße 1',
  postalCodeAndCity: '12345 Musterstadt',
  phone: '+49 000 000000',
  directEmail: 'hello@example.com',
  disputeResolutionMarkdown: '',
  socialLinks: [
    {
      id: 'mock-github',
      profileId: 'mock-profile',
      platformName: 'GitHub',
      url: 'https://github.com/',
      iconKey: 'github',
      displayOrder: 1,
    },
    {
      id: 'mock-linkedin',
      profileId: 'mock-profile',
      platformName: 'LinkedIn',
      url: 'https://www.linkedin.com/',
      iconKey: 'linkedin',
      displayOrder: 2,
    },
  ],
};

export const mockLegalNotice: LegalNotice = {
  fullName: mockProfile.fullName,
  streetAddress: mockProfile.streetAddress,
  postalCodeAndCity: mockProfile.postalCodeAndCity,
  phone: mockProfile.phone,
  directEmail: mockProfile.directEmail,
  disputeResolutionMarkdown: mockProfile.disputeResolutionMarkdown,
};