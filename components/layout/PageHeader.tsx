import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  loanAmount?: number;
  isSubmitting?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  showBackButton = true,
  onBack,
}) => {
  const router = useRouter();

  return (
    <div className='bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-4'>
      <div className='flex items-center gap-3'>
        {showBackButton && (
          <button
            onClick={onBack || (() => router.push('/'))}
            className='text-white transition-opacity hover:opacity-80'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
        )}
        <h1 className='text-xl font-semibold text-white'>{title}</h1>
      </div>

      {(subtitle || imageUrl) && (
        <div className='px-4 mt-6 text-white'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='mb-2 text-2xl font-bold'>{title}</h2>
                {subtitle && <p className='text-white/80'>{subtitle}</p>}
              </div>
              {imageUrl && (
                <div className='relative w-20 h-20'>
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={80}
                    height={80}
                    className='brightness-0 invert opacity-90'
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
