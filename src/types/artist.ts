
export interface ArtistProfile {
  experience?: string[];
  shows?: string[];
  equipment?: string[];
  timeRequirements?: string[];
  education?: string[];
  teamMembers?: string[];
}

export interface OnboardingCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  field: keyof ArtistProfile;
}
