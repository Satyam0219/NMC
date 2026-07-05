/*import Link from 'next/link';
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
}*/
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#F9F9F9] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
        
        {/* Success Icon Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <CheckCircle className="w-20 h-20 text-green-500 relative z-10 bg-white rounded-full" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Thank you for your purchase. We've received your order and are getting it ready for shipment.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-[#0F4C5C] font-bold">
            <Package className="w-5 h-5" />
            <span>What happens next?</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="font-bold text-gray-900">1.</span> 
              You will receive an order confirmation email shortly.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-gray-900">2.</span> 
              We will process and pack your items safely.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-gray-900">3.</span> 
              You can track your order status in your profile.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/profile" 
            className="block w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            View My Orders
          </Link>
          <Link 
            href="/shop" 
            className="block w-full bg-white text-gray-900 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}