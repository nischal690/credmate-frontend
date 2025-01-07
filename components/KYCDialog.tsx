'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface KYCDialogProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export default function KYCDialog({
  isOpen,
  onClose,
  redirectPath,
  title = 'Complete KYC Required',
  description = 'To access your detailed credit report, you need to complete the KYC process first. This helps us verify your identity and provide accurate credit information.',
  primaryButtonText = 'Start KYC Process',
  secondaryButtonText = 'Maybe Later',
}: KYCDialogProps) {
  const router = useRouter();
  const { userProfile } = useUser();

  const handleRedirect = () => {
    const path = redirectPath || `/profile/${userProfile?.id}`;
    router.push(path);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 mt-4'>
          <Button
            onClick={handleRedirect}
            className='w-full bg-[#A2195E] hover:bg-[#894567]'
          >
            {primaryButtonText}
          </Button>
          <Button variant='outline' onClick={onClose} className='w-full'>
            {secondaryButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
