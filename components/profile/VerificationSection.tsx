import { Button } from '@/components/ui/button';

interface VerificationSectionProps {
  type: 'aadhar' | 'pan' | 'gst';
  value: string;
  label: string;
  userPlan: UserPlan;
  onVerify: (type: string) => void;
  onUpgrade: () => void;
}

export function VerificationSection({
  type,
  value,
  label,
  userPlan,
  onVerify,
  onUpgrade,
}: VerificationSectionProps) {
  const canVerify = () => {
    switch (userPlan) {
      case 'free':
        return false; // All require upgrade
      case 'proIndividual':
        return type === 'aadhar' || type === 'pan';
      case 'proBusiness':
      case 'priorityBusiness':
        return true; // All can verify
      default:
        return false;
    }
  };

  return (
    <div className='p-4 rounded-lg bg-gray-50'>
      <div className='text-sm font-medium text-gray-500'>{label}</div>
      <div className='mb-3 text-base'>{value || 'Not provided'}</div>
      {canVerify() ? (
        <Button
          onClick={() => onVerify(type)}
          className='bg-pink-600 hover:bg-pink-700'
        >
          Click to Verify
        </Button>
      ) : (
        <Button
          onClick={onUpgrade}
          className='text-pink-600 bg-pink-100 border-pink-600 rounded-2xl hover:border-pink-700 hover:bg-pink-600 hover:text-white'
        >
          Upgrade to Verify
        </Button>
      )}
    </div>
  );
}
