'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import toast from 'react-hot-toast';
import { Mail, Lock, User, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';

type AuthView = 'login' | 'signup' | 'otp' | 'forgot_password';

export default function LoginPage() {
  const [view, setView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const redirectedFrom = searchParams.get('redirectedFrom') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully logged in!');
      router.push(redirectedFrom);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      toast.success('OTP sent to your email!');
      setView('otp'); // Move to OTP screen
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });
      if (error) throw error;
      toast.success('Account verified successfully!');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email.');
      setView('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
        {/* Dynamic Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'otp' && 'Verify Email'}
            {view === 'forgot_password' && 'Reset Password'}
          </h2>
          <p className="text-gray-500 mt-2">
            {view === 'otp' ? `Enter the 6-digit code sent to ${email}` : 'Secure access to your store account.'}
          </p>
        </div>

        {/* Dynamic Forms */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <InputField icon={<Mail />} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
            <InputField icon={<Lock />} type="password" placeholder="Password" value={password} onChange={setPassword} />
            
            <div className="flex justify-end">
              <button type="button" onClick={() => setView('forgot_password')} className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>
            
            <SubmitButton isLoading={isLoading} text="Sign In" />
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-blue-600 font-semibold hover:underline">Sign up</button>
            </p>
          </form>
        )}

        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-5">
            <InputField icon={<User />} type="text" placeholder="Full Name" value={name} onChange={setName} />
            <InputField icon={<Mail />} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
            <InputField icon={<Lock />} type="password" placeholder="Create Password (min 6 chars)" value={password} onChange={setPassword} minLength={6} />
            
            <SubmitButton isLoading={isLoading} text="Create Account" />
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <button type="button" onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">Sign in</button>
            </p>
          </form>
        )}

        {view === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <InputField icon={<KeyRound />} type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={setOtp} />
            
            <SubmitButton isLoading={isLoading} text="Verify Account" />
            
            <div className="flex justify-between items-center text-sm mt-4">
              <button type="button" onClick={() => setView('signup')} className="text-gray-500 hover:underline">← Back</button>
              <button type="button" onClick={handleSignup} disabled={isLoading} className="text-blue-600 font-semibold hover:underline disabled:opacity-50">Resend Code</button>
            </div>
          </form>
        )}

        {view === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <InputField icon={<Mail />} type="email" placeholder="Enter your email" value={email} onChange={setEmail} />
            
            <SubmitButton isLoading={isLoading} text="Send Reset Link" />
            
            <div className="text-center mt-4">
              <button type="button" onClick={() => setView('login')} className="text-sm font-medium text-gray-500 hover:underline">
                ← Back to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

// Reusable UI Components for the forms
function InputField({ icon, type, placeholder, value, onChange, minLength }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">{icon}</div>
      <input
        type={type}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

function SubmitButton({ isLoading, text }: { isLoading: boolean, text: string }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70"
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : text}
    </button>
  );
}