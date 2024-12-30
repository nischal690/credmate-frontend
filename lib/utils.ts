import { ProfileData, UserPlan, VerificationType } from '@/types/profile';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to determine if user needs to upgrade based on plan
export function needsPlanUpgrade(
  currentPlan: UserPlan | undefined,
  verificationType: VerificationType
): boolean {
  // Define which verifications are available for each plan
  const planPermissions: Record<UserPlan, VerificationType[]> = {
    FREE: ['pan'],
    PRO_INDIVIDUAL: ['aadhar', 'pan'],
    PRO_BUSINESS: ['aadhar', 'pan', 'gst'],
    PRIORITY_BUSINESS: ['aadhar', 'pan', 'gst'],
  };

  // Default to FREE plan if undefined
  const plan = currentPlan || 'FREE';

  // Make sure the plan exists in permissions
  if (!planPermissions[plan]) {
    console.warn(`Unknown plan type: ${plan}`);
    return true; // Require upgrade for unknown plans
  }

  return !planPermissions[plan].includes(verificationType);
}

// Helper function to map API data to ProfileData
export function mapApiDataToProfile(apiData: any): ProfileData {
  return {
    ...apiData,
    // Map the differently named fields
    phone: apiData.phoneNumber,
    aadharNo: apiData.aadhaarNumber,
    panNo: apiData.panNumber,
    // Ensure plan is uppercase to match UserPlan type
    plan: apiData.plan?.toUpperCase() as UserPlan,
    // Add default values for optional fields
    address: apiData.address || '',
    bio: apiData.bio || '',
    gstNo: apiData.gstNo || '',
    // Initialize verification states if not present
    verifications: apiData.verifications || {
      aadhar: { status: 'not_started' },
      pan: { status: 'not_started' },
      gst: { status: 'not_started' },
    },
  };
}

// Helper function to get user plan display name
export function getPlanDisplayName(plan: UserPlan): string {
  const planNames: Record<UserPlan, string> = {
    FREE: 'Free Plan',
    PRO_INDIVIDUAL: 'Pro Individual',
    PRO_BUSINESS: 'Pro Business',
    PRIORITY_BUSINESS: 'Priority Business',
  };
  return planNames[plan] || 'Unknown Plan';
}

export const createInitialProfileState = (): ProfileData => ({
  id: '',
  name: '',
  email: null,
  phoneNumber: '',
  date_of_birth: '',
  businessType: '',
  profileImageUrl: null,
  aadhaarNumber: null,
  panNumber: null,
  plan: 'FREE',
  referralCode: '',
  planPrice: null,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: null,
  address: '',
  bio: '',
  gstNo: '',
  verifications: {
    aadhar: { status: 'not_started' },
    pan: { status: 'not_started' },
    gst: { status: 'not_started' },
  },
});

export const getInitialProfileState = () => {
  try {
    const storedProfile = localStorage.getItem('user_profile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      return {
        ...createInitialProfileState(),
        ...parsedProfile,
        verifications: {
          aadhar: { status: 'not_started' },
          pan: { status: 'not_started' },
          gst: { status: 'not_started' },
        },
      };
    }
  } catch (error) {
    console.error('Error parsing stored profile:', error);
  }
  return createInitialProfileState();
};
