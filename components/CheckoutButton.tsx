'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

// 1. Update the interface to include amountToCharge
export default function CheckoutButton({ 
  address, 
  amountToCharge 
}: { 
  address: any; 
  amountToCharge: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart } = useCartStore();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Use the new amountToCharge for the backend order creation
      const orderRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountToCharge })
      });
      const order = await orderRes.json();

      // 3. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: 'My Modern Store',
        description: 'Store Purchase',
        order_id: order.id,
        handler: async function (response: any) {
          // 4. Verify Payment securely
          const verifyRes = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: { amount: amountToCharge, address }
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Payment successful!');
            clearCart();
            window.location.href = '/success';
          } else {
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#2563eb', // Updated to match your Tailwind blue-600
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error('Something went wrong during checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={isLoading || amountToCharge === 0}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
    >
      {isLoading ? 'Processing...' : `Pay ₹${amountToCharge.toLocaleString()}`}
    </button>
  );
}