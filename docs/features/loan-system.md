# Loan System Documentation

## Overview
The loan system manages the entire loan lifecycle, from application to disbursement and repayment tracking.

## Components

### LoanApplication
Location: `/app/components/LoanApplication.tsx`

Purpose: Handles the loan application process.

Features:
- Multi-step form
- Document upload
- Eligibility check
- EMI calculator
- Terms and conditions

```typescript
interface LoanApplication {
  id: string;
  amount: number;
  tenure: number;
  purpose: string;
  status: LoanStatus;
  documents: Document[];
  applicant: UserProfile;
  createdAt: string;
  updatedAt: string;
}

type LoanStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'disbursed';
```

### EMICalculator
Location: `/app/components/EMICalculator.tsx`

Purpose: Calculates loan EMI and provides payment schedule.

Features:
- Interactive sliders
- Payment breakdown
- Amortization schedule
- Interest visualization

```typescript
interface EMICalculation {
  principal: number;
  interest: number;
  tenure: number;
  emi: number;
  totalPayment: number;
  schedule: EMISchedule[];
}

interface EMISchedule {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}
```

## API Integration

### Endpoints
```typescript
export const LOAN_ENDPOINTS = {
  APPLY: '/loan/apply',
  STATUS: '/loan/status',
  DOCUMENTS: '/loan/documents',
  ELIGIBILITY: '/loan/check-eligibility',
  EMI_CALCULATOR: '/loan/emi-calculator',
};
```

### Data Handling
```typescript
async function submitLoanApplication(data: LoanApplicationData): Promise<LoanApplication> {
  const response = await apiService.post(LOAN_ENDPOINTS.APPLY, data);
  return response.data;
}

async function checkEligibility(criteria: EligibilityCriteria): Promise<EligibilityResult> {
  const response = await apiService.post(LOAN_ENDPOINTS.ELIGIBILITY, criteria);
  return response.data;
}
```

## Document Management

### Required Documents
1. Identity Proof
2. Address Proof
3. Income Proof
4. Bank Statements
5. Additional Documents (case-specific)

### Document Upload
```typescript
interface Document {
  type: DocumentType;
  file: File;
  status: 'pending' | 'verified' | 'rejected';
  remarks?: string;
}

async function uploadDocument(loanId: string, document: Document): Promise<void> {
  const formData = new FormData();
  formData.append('file', document.file);
  formData.append('type', document.type);
  
  await apiService.post(`${LOAN_ENDPOINTS.DOCUMENTS}/${loanId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
```

## Loan Processing

### Status Flow
```
Draft -> Submitted -> Under Review -> Approved/Rejected -> Disbursed
```

### Status Management
```typescript
interface StatusUpdate {
  status: LoanStatus;
  remarks?: string;
  updatedBy: string;
  timestamp: string;
}

async function updateLoanStatus(
  loanId: string, 
  update: StatusUpdate
): Promise<void> {
  await apiService.put(`${LOAN_ENDPOINTS.STATUS}/${loanId}`, update);
}
```

## EMI Calculation System

### Calculation Formula
```typescript
function calculateEMI(
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  const ratePerMonth = ratePerAnnum / (12 * 100);
  const emi = principal * ratePerMonth * 
    Math.pow(1 + ratePerMonth, tenureMonths) / 
    (Math.pow(1 + ratePerMonth, tenureMonths) - 1);
  return Math.round(emi);
}
```

### Implementation Example
```typescript
function EMICalculator() {
  const [values, setValues] = useState({
    amount: 100000,
    tenure: 12,
    rate: 10.5
  });

  const calculateLoanSchedule = useCallback(() => {
    const emi = calculateEMI(values.amount, values.rate, values.tenure);
    // Generate schedule...
    return schedule;
  }, [values]);

  return (
    <div className="emi-calculator">
      {/* Calculator UI */}
    </div>
  );
}
```

## Best Practices

### 1. Data Validation
- Validate all inputs
- Implement proper form validation
- Check document formats and sizes

### 2. Error Handling
```typescript
try {
  await submitLoanApplication(data);
} catch (error) {
  if (error.response?.status === 422) {
    // Handle validation errors
  } else if (error.response?.status === 403) {
    // Handle eligibility issues
  } else {
    // Handle other errors
  }
}
```

### 3. Security
- Encrypt sensitive data
- Implement proper access controls
- Validate document authenticity
- Secure file uploads

### 4. Performance
- Optimize file uploads
- Implement proper loading states
- Cache calculation results
- Use proper compression

### 5. User Experience
- Clear progress indicators
- Helpful error messages
- Interactive calculators
- Mobile-responsive design

### 6. Monitoring
- Track application status
- Monitor document verification
- Log important events
- Track user interactions
