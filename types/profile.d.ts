type VerificationType = 'aadhar' | 'pan' | 'gst';
type VerificationStatus = 'pending' | 'verified' | 'failed' | 'not_started';
type UserPlan = 'free' | 'proIndividual' | 'proBusiness' | 'priorityBusiness';

interface VerificationState {
  status: VerificationStatus;
  lastAttempt?: string;
  message?: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  aadharNo: string;
  panNo: string;
  gstNo: string;
  profileImageUrl?: string;
  verifications?: {
    aadhar?: VerificationState;
    pan?: VerificationState;
    gst?: VerificationState;
  };
}
