import { useState } from 'react';
import { type LoanFormData } from '@/types/loan';

const defaultFormData: LoanFormData = {
  type: 'request',
  loanAmount: '',
  loanTerm: '',
  timeUnit: 'month',
  interestRate: '',
  paymentType: 'onetime',
  emiFrequency: 'monthly',
  // Default values for report type
  borrowerPhone: '',
  dueDate: '',
  consent: false,
  reportType: 'report_only',
};

export function useLoanForm(type: LoanFormData['type'] = 'request') {
  const [formData, setFormData] = useState<LoanFormData>({
    ...defaultFormData,
    type,
  });

  const updateFormData = (data: Partial<LoanFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const calculateEMI = () => {
    if (!formData.loanAmount || !formData.interestRate || !formData.loanTerm)
      return 0;

    const principal = parseFloat(formData.loanAmount);
    const ratePerPeriod =
      parseFloat(formData.interestRate) /
      100 /
      (formData.emiFrequency === 'daily' ? 365 : 12);
    let numberOfPayments: number;

    if (formData.timeUnit === 'year') {
      numberOfPayments =
        formData.emiFrequency === 'daily'
          ? 365 * parseFloat(formData.loanTerm)
          : 12 * parseFloat(formData.loanTerm);
    } else if (formData.timeUnit === 'month') {
      numberOfPayments =
        formData.emiFrequency === 'daily'
          ? 30 * parseFloat(formData.loanTerm)
          : parseFloat(formData.loanTerm);
    } else {
      numberOfPayments =
        formData.emiFrequency === 'daily'
          ? parseFloat(formData.loanTerm)
          : parseFloat(formData.loanTerm) / 30;
    }

    const emi =
      (principal *
        ratePerPeriod *
        Math.pow(1 + ratePerPeriod, numberOfPayments)) /
      (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);

    return isNaN(emi) ? 0 : emi;
  };

  return {
    formData,
    updateFormData,
    calculateEMI,
  };
}
