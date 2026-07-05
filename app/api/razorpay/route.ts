import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
