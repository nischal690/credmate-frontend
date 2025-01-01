'use client';

import { getPlanDisplayName, needsPlanUpgrade } from '@/lib/utils';
import { VerificationType, UserPlan, VerificationState } from '@/types/profile';
import { CircularProgress } from '@mui/material';

interface VerificationSectionProps {
  type: VerificationType;
  label: string;
  value: string | null;
  userPlan: UserPlan;
  onVerify: (type: VerificationType) => void;
  onUpgrade: () => void;
  isLoading?: boolean;
  verificationState?: VerificationState;
}

export function VerificationSection({
  type,
  label,
  value,
  userPlan,
  onVerify,
  onUpgrade,
  isLoading = false,
  verificationState,
}: VerificationSectionProps) {
  const requiresUpgrade = needsPlanUpgrade(userPlan || 'FREE', type);

  // Determine verification status
  const status =
    verificationState?.status || (value ? 'verified' : 'not_started');

  // Get display text based on status
  const getStatusText = () => {
    if (value && status === 'verified') return value;
    switch (status) {
      case 'pending':
        return 'Verification in progress...';
      case 'failed':
        return verificationState?.message || 'Verification failed';
      case 'verified':
        return value;
      default:
        return 'Not verified';
    }
  };

  // Get button text based on status
  const getButtonText = () => {
    if (isLoading) return 'Verifying...';
    switch (status) {
      case 'pending':
        return 'In Progress';
      case 'failed':
        return 'Try Again';
      case 'verified':
        return 'Verified';
      default:
        return 'Verify Now';
    }
  };

  // Get button styles based on status
  const getButtonStyles = () => {
    const baseStyles =
      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 rounded-xl';

    if (isLoading || status === 'pending') {
      return `${baseStyles} bg-yellow-100 text-yellow-800 cursor-wait`;
    }

    switch (status) {
      case 'failed':
        return `${baseStyles} bg-red-100 text-red-800 hover:bg-red-200`;
      case 'verified':
        return `${baseStyles} bg-green-100 text-green-800`;
      default:
        return `${baseStyles} bg-pink-600 text-white hover:bg-pink-700`;
    }
  };

  return (
    <div className='p-4 bg-white shadow rounded-xl'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h3 className='font-medium text-gray-900'>{label}</h3>
          <p
            className={`text-sm ${status === 'failed' ? 'text-red-500' : 'text-gray-500'}`}
          >
            {getStatusText()}
          </p>
          {verificationState?.lastAttempt && status !== 'verified' && (
            <p className='mt-1 text-xs text-gray-400'>
              Last attempt:{' '}
              {new Date(verificationState.lastAttempt).toLocaleDateString()}
            </p>
          )}
        </div>

        {requiresUpgrade ? (
          <button
            onClick={onUpgrade}
            className='px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-pink-600 rounded-lg hover:bg-pink-700 rounded-xl'
          >
            Upgrade Plan
          </button>
        ) : (
          <button
            onClick={() => onVerify(type)}
            disabled={
              isLoading || status === 'pending' || status === 'verified'
            }
            className={getButtonStyles()}
          >
            <span className='flex items-center gap-2'>
              {isLoading && (
                <CircularProgress size={16} className='text-current' />
              )}
              {getButtonText()}
            </span>
          </button>
        )}
      </div>

      {requiresUpgrade && (
        <p className='mt-2 text-xs text-gray-500'>
          This verification is available in{' '}
          {getPlanDisplayName(
            userPlan === 'FREE' ? 'PRO_INDIVIDUAL' : 'PRO_BUSINESS'
          )}
        </p>
      )}

      {/* Show error message if verification failed */}
      {status === 'failed' && verificationState?.message && (
        <p className='mt-2 text-xs text-red-500'>
          Error: {verificationState.message}
        </p>
      )}
    </div>
  );
}
