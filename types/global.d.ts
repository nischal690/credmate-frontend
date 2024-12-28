interface Plan {
  name: string;
  price: string;
  period: string;
  icon: React.ReactNode; // Since we're using MUI icons
  type: 'individual' | 'business';
  features: string[];
  popular?: boolean;
  isPriority?: boolean;
}
