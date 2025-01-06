'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ReportBorrowerAppBar } from '@/components/report-borrower-app-bar';
import { ReportTypeSelector } from '@/components/shared/report-type-selector';
import { ReportForm } from '@/components/shared/report-form';
import { InfoModal } from '@/components/shared/info-modal';
import { ReportModalContent } from '@/components/shared/report-modal-content';
import { RecoveryModalContent } from '@/components/shared/recovery-modal-content';
import { useLoanForm } from '@/hooks/use-loan-form';
import { useUser } from '@/contexts/UserContext';
import api from '@/utils/api';
import KYCDialog from '@/components/KYCdialog';

export default function ReportBorrowerPage() {
  const router = useRouter();
  const { userProfile } = useUser();
  const { formData, updateFormData } = useLoanForm('report');

  const [openRecoveryModal, setOpenRecoveryModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showKYCDialog, setShowKYCDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userProfile?.plan === 'FREE' || !userProfile?.credit_score_enabled) {
      setShowKYCDialog(true);
      return;
    }

    if (warningMessage) {
      console.log('Form submission blocked due to warning:', warningMessage);
      return;
    }

    try {
      const requestBody = {
        mobileNumber: `+91${formData.borrowerPhone}`,
        unpaidAmount: parseFloat(formData.loanAmount),
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : new Date().toISOString(),
        recoveryMode: formData.reportType === 'recovery_service',
      };

      await api.post('/borrower/report_borrower', requestBody);
      router.push('/report-success');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = async (field: string, value: string | boolean) => {
    updateFormData({ [field]: value });

    if (field === 'borrowerPhone' && typeof value === 'string') {
      const cleanNumber = value.replace(/[^\d]/g, '').slice(0, 10);

      if (cleanNumber.length === 10) {
        try {
          const { data } = await api.get(`/search/mobile/+91${cleanNumber}`);
          if (data.name) {
            setWarningMessage(
              `The phone number belongs to ${data.name} who is already a part of the Credmate community.`
            );
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            setWarningMessage(
              'The person is not currently onboarded in Credmate. We will reach out to them.'
            );
          }
        }
      }
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50'>
      <ReportBorrowerAppBar />

      <div className='flex-1 overflow-y-auto'>
        <Container maxWidth='sm' className='px-4 py-6 pb-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='relative p-6 mt-4 bg-white shadow-xl rounded-3xl'>
              {/* Info Box */}
              <motion.div
                className='p-4 mb-6 border border-orange-200 bg-orange-50 rounded-2xl'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
                  <p className='text-sm text-orange-700'>
                    Please ensure all information provided is accurate. False
                    reporting may lead to legal consequences.
                  </p>
                </div>
              </motion.div>

              <ReportTypeSelector
                value={formData.reportType || 'report_only'}
                onChange={(value: 'report_only' | 'recovery_service') =>
                  updateFormData({ reportType: value })
                }
                onInfoClick={(type) => {
                  if (type === 'report_only') setOpenReportModal(true);
                  else setOpenRecoveryModal(true);
                }}
              />

              <ReportForm
                formData={formData}
                warningMessage={warningMessage}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        </Container>
      </div>

      <InfoModal
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        title='Why Report a Defaulter?'
        description='Has someone broken your trust by not returning borrowed money? Help protect others from experiencing the same by reporting the defaulter.'
      >
        <ReportModalContent />
      </InfoModal>

      <InfoModal
        open={openRecoveryModal}
        onClose={() => setOpenRecoveryModal(false)}
        title='Recovery Service Process'
        description="We understand that informal lending is often based on trust. While having proof of lending (like messages, transactions, or documents) increases recovery chances, we'll still assist even without formal documentation."
      >
        <RecoveryModalContent />
      </InfoModal>

      <KYCDialog
        isOpen={showKYCDialog}
        onClose={() => setShowKYCDialog(false)}
        title='KYC Required'
        description='To report a borrower, you need to complete the KYC process first.'
      />
    </div>
  );
}
