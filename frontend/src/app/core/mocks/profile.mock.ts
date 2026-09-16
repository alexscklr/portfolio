import { LegalNotice, Profile } from '../models';
import { DEFAULT_LANGUAGE, Language } from '../config/languages';

export const mockProfile: Profile = {
  id: 'mock-profile',
  fullName: 'Alexander Mustermann',
  jobTitle: 'Full-Stack Developer',
  bioMarkdown:
    'Ich entwickle digitale Produkte mit einem Fokus auf klare Interfaces, robuste APIs und nachhaltige Architektur.',
  avatarUrl: '/media/fixtures/avatar-alexander.svg',
  location: 'Deutschland',
  publicEmail: 'hello@example.com',
  streetAddress: 'Musterstraße 1',
  postalCodeAndCity: '12345 Musterstadt',
  phoneNumber: '+49 000 000000',
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
  phoneNumber: mockProfile.phoneNumber,
  directEmail: mockProfile.directEmail,
  disputeResolutionMarkdown: mockProfile.disputeResolutionMarkdown,
};

const localizedProfileContent: Record<Language, Pick<Profile, 'jobTitle' | 'bioMarkdown' | 'location'>> = {
  de: {
    jobTitle: 'Full-Stack Developer',
    bioMarkdown: 'Ich entwickle digitale Produkte mit einem Fokus auf klare Interfaces, robuste APIs und nachhaltige Architektur.',
    location: 'Deutschland'
  },
  en: {
    jobTitle: 'Full-Stack Developer',
    bioMarkdown: 'I build digital products focused on clear interfaces, robust APIs, and sustainable architecture.',
    location: 'Germany'
  }
};

export function getMockProfile(language: Language = DEFAULT_LANGUAGE): Profile {
  return {
    ...structuredClone(mockProfile),
    ...localizedProfileContent[language]
  };
}

export function getMockLegalNotice(language: Language = DEFAULT_LANGUAGE): LegalNotice {
  const profile = getMockProfile(language);

  return {
    fullName: profile.fullName,
    streetAddress: profile.streetAddress,
    postalCodeAndCity: profile.postalCodeAndCity,
    phoneNumber: profile.phoneNumber,
    directEmail: profile.directEmail,
    disputeResolutionMarkdown: profile.disputeResolutionMarkdown
  };
}