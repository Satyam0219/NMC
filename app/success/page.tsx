import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-emerald-500" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500">
            Thank you for your purchase. Your order has been securely processed and is now being prepared for shipping.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href="/profile/orders" 
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            View Order Status
          </Link>
          <Link 
            href="/" 
            className="w-full bg-white text-gray-900 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}