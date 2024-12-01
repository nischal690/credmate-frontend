import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Replace with actual API call to your backend
    // This is mock data for demonstration
    const mockProfiles = [
      {
        id: '1',
        name: 'John Doe',
        phoneNumber: '+91 9876543210',
        aadhaarNumber: 'XXXX-XXXX-1234',
        panNumber: 'ABCDE1234F',
      },
      {
        id: '2',
        name: 'Jane Smith',
        phoneNumber: '+91 9876543211',
        aadhaarNumber: 'XXXX-XXXX-5678',
        panNumber: 'FGHIJ5678K',
      },
    ];

    return NextResponse.json(mockProfiles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch saved profiles' },
      { status: 500 }
    );
  }
}
