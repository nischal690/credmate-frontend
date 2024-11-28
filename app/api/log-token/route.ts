import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    // Log the token to the server console
    console.log('\n=== Firebase ID Token ===');
    console.log(token);
    console.log('========================\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in log-token API:', error);
    return NextResponse.json({ error: 'Failed to log token' }, { status: 500 });
  }
}
