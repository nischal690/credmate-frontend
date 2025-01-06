export interface LoanFormData {
  type: 'give' | 'request' | 'report';
  loanAmount: string;
  loanTerm: string;
  timeUnit: 'day' | 'month' | 'year';
  interestRate: string;
  paymentType: 'onetime' | 'emi';
  emiFrequency?: 'daily' | 'weekly' | 'monthly';
  // Additional fields for report type
  borrowerPhone?: string;
  dueDate?: string;
  consent?: boolean;
  reportType?: 'report_only' | 'recovery_service';
}

export interface Profile {
  id: string;
  name: string;
  mobile: string;
  image: string;
}
