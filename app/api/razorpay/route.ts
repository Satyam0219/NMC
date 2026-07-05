/*import { NextResponse } from 'next/server';
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
}*/
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay'; // <-- Import the raw package, not your lib!

export async function POST(req: Request) {
  try {
    // 1. Initialize Razorpay INSIDE the request handler. 
    // This hides it from Vercel's build process!
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const { amount } = await req.json();

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
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