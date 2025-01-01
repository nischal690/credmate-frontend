import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DateOfBirthInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateOfBirthInput({ value, onChange }: DateOfBirthInputProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate ? format(newDate, 'yyyy-MM-dd') : '');
  };

  return (
    <div className='flex gap-2'>
      <Input
        type='date'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full'
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='w-4 h-4 mr-2' />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
