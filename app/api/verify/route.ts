import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Save order to Supabase securely via Admin role
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          razorpay_order_id,
          razorpay_payment_id,
          total_amount: orderDetails.amount,
          shipping_address: orderDetails.address,
          status: 'paid'
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data[0] });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
