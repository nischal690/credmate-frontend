import { ProfileData } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateOfBirthInput } from '@/components/ui/DateOfBirthinput';

export function ProfileForm({
  profileData,
  onChange,
}: {
  profileData: ProfileData;
  onChange: (field: keyof ProfileData, value: string) => void;
}) {
  const excludedFields = [
    'id',
    'profileImageUrl',
    'verifications',
    'createdAt',
    'updatedAt',
    'metadata',
    'status',
    'plan',
    'planPrice',
  ];

  return (
    <div className='space-y-6'>
      {Object.entries(profileData)
        .filter(([field]) => !excludedFields.includes(field))
        .map(([field, value]) => (
          <div key={field} className='space-y-2'>
            <Label
              htmlFor={field}
              className='text-sm font-medium text-gray-700 capitalize'
            >
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            {field === 'date_of_birth' ? (
              <DateOfBirthInput
                value={value as string}
                onChange={(newValue) =>
                  onChange(field as keyof ProfileData, newValue)
                }
              />
            ) : field === 'bio' ? (
              <Textarea
                id={field}
                value={value as string}
                onChange={(e) =>
                  onChange(field as keyof ProfileData, e.target.value)
                }
                className='w-full min-h-[100px]'
              />
            ) : (
              <Input
                id={field}
                type={field === 'email' ? 'email' : 'text'}
                value={value as string}
                onChange={(e) =>
                  onChange(field as keyof ProfileData, e.target.value)
                }
                className='w-full'
              />
            )}
          </div>
        ))}
      {(profileData.plan || profileData.planPrice) && (
        <div className='p-4 mt-6 space-y-2 bg-gray-100 rounded-md'>
          {profileData.plan && (
            <div>
              <Label className='text-sm font-medium text-gray-700'>Plan</Label>
              <p className='mt-1 text-sm text-gray-900'>{profileData.plan}</p>
            </div>
          )}
          {profileData.planPrice && (
            <div>
              <Label className='text-sm font-medium text-gray-700'>
                Plan Price
              </Label>
              <p className='mt-1 text-sm text-gray-900'>
                ${profileData.planPrice}
              </p>
            </div>
          )}
        </div>
      )}
      {profileData.status && (
        <div className='p-4 mt-6 bg-gray-100 rounded-md'>
          <Label className='text-sm font-medium text-gray-700'>Status</Label>
          <p className='mt-1 text-sm text-gray-900'>{profileData.status}</p>
        </div>
      )}
    </div>
  );
}
