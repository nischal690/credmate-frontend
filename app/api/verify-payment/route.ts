import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Create the signature verification text
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Create the signature using HMAC SHA256
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    // Verify the signature
    const isAuthentic = generated_signature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      // Here you can update your database to mark the payment as successful
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
