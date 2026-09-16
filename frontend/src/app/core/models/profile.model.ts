export interface SocialLink {
  id: string;
  profileId: string;
  platformName: string;
  url: string;
  iconKey: string;
  displayOrder: number;
}

export interface Profile {
  id: string;
  fullName: string;
  jobTitle: string;
  bioMarkdown: string;
  avatarUrl?: string;
  location: string;
  publicEmail: string;

  // Legal / Impressum
  streetAddress: string;
  postalCodeAndCity: string;
  phoneNumber: string;
  directEmail: string;
  disputeResolutionMarkdown?: string;

  socialLinks: SocialLink[];
}

export interface LegalNotice {
  fullName: string;
  streetAddress: string;
  postalCodeAndCity: string;
  phoneNumber: string;
  directEmail: string;
  disputeResolutionMarkdown?: string;
}