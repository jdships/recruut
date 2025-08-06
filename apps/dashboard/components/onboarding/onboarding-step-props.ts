export type OnboardingMetadata = {
  user?: {
    image?: string | null;
    name?: string;
    phone?: string;
    email: string;
  };
  organization?: {
    logo?: string;
    name?: string;
    slug?: string;
  };
  invitations?: {
    id: string;
    organization: {
      logo?: string;
      name: string;
      slug: string;
      memberCount: number;
    };
  }[];
};

export type OnboardingStepProps = {
  metadata: OnboardingMetadata;
  canNext: boolean;
  loading: boolean;
  isLastStep: boolean;
  handleNext: () => void;
};
