'use client';

import React from 'react';
import { 
  SwipeableDrawer, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import GppGoodIcon from '@mui/icons-material/GppGood';

interface ProtectionPlanSheetProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSelect: (plan: string) => void;
  selectedPlan: string;
  loanAmount: number;
}

const ProtectionPlanSheet: React.FC<ProtectionPlanSheetProps> = ({
  open,
  onClose,
  onOpen,
  onSelect,
  selectedPlan,
  loanAmount
}) => {
  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(event.target.value);
  };

  const plans = [
    {
      id: 'free',
      name: 'Basic Contract',
      description: 'Basic proof of transaction with no additional costs',
      icon: <ShieldIcon />,
      cost: 'Free',
      features: ['Basic loan agreement documentation', 'Digital contract', 'No recovery support']
    },
    {
      id: 'standard',
      name: 'Standard Protection',
      description: '2% of loan amount for enhanced protection',
      icon: <SecurityIcon />,
      cost: `₹${Math.round(loanAmount * 0.02).toLocaleString()}`,
      features: ['All Basic features', 'Priority support', 'Basic recovery assistance']
    },
    {
      id: 'premium',
      name: 'Advanced Protection',
      description: '5% of loan amount for comprehensive coverage',
      icon: <GppGoodIcon />,
      cost: `₹${Math.round(loanAmount * 0.05).toLocaleString()}`,
      features: ['All Standard features', '24/7 dedicated support', 'Full recovery assistance', 'Legal documentation support']
    }
  ];

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          maxHeight: '90vh'
        }
      }}
    >
      <div className="px-4 py-6">
        <Typography variant="h6" component="h2" className="mb-4 text-center font-semibold">
          Select Protection Plan
        </Typography>
        
        <RadioGroup value={selectedPlan} onChange={handlePlanChange}>
          <List>
            {plans.map((plan, index) => (
              <React.Fragment key={plan.id}>
                <ListItem className="flex flex-col items-start p-4 hover:bg-gray-50 rounded-lg">
                  <FormControlLabel
                    value={plan.id}
                    control={<Radio />}
                    label={
                      <div className="flex flex-col ml-2">
                        <div className="flex items-center gap-2">
                          <ListItemIcon className="min-w-0">
                            {plan.icon}
                          </ListItemIcon>
                          <div>
                            <Typography variant="subtitle1" component="span" className="font-medium">
                              {plan.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="block">
                              {plan.description}
                            </Typography>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Typography variant="subtitle2" color="primary" className="font-semibold mb-1">
                            Cost: {plan.cost}
                          </Typography>
                          <ul className="list-disc ml-4 text-sm text-gray-600">
                            {plan.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    }
                    className="m-0 w-full"
                  />
                </ListItem>
                {index < plans.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </RadioGroup>
      </div>
    </SwipeableDrawer>
  );
};

export default ProtectionPlanSheet;
