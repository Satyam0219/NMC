import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { User } from "lucide-react";
import Footer from "@/components/Footer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import NavbarCartIcon from "@/components/NavbarCartIcon";
import NavbarSearch from "@/components/NavbarSearch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NMC | Precision Hygiene",
  description: "Built with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Await cookies for Next.js 15
  const cookieStore = await cookies();

  // 2. Initialize Supabase to securely check the session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // 3. Fetch the user and check if they are the admin
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAFA] min-h-screen flex flex-col text-gray-900`}>
        
        {/* Modern Centered Navigation Bar */}
        <nav className="bg-[#FAFAFA] sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              
              {/* Left: Logo */}
              <div className="flex-1">
                <Link href="/" className="text-2xl font-extrabold tracking-tighter">
                  NMC
                </Link>
              </div>

              {/* Center: Navigation Links */}
              <div className="hidden md:flex items-center justify-center gap-8 flex-1">
                <Link href="/shop" className="text-sm font-medium hover:text-gray-500 transition">
                  Shop
                </Link>
                <Link href="/about" className="text-sm font-medium hover:text-gray-500 transition">
                  About Us
                </Link>
                <Link href="/contact" className="text-sm font-medium hover:text-gray-500 transition">
                  Contact
                </Link>
                
                {/* CONDITIONAL RENDER: Only show if the user is the Admin */}
                {isAdmin && (
                  <Link href="/admin/products" className="text-sm font-bold text-[#0F4C5C] hover:text-[#0a3642] transition">
                    Admin Dashboard
                  </Link>
                )}
              </div>
              
              {/* Right: Icons */}
              <div className="flex items-center justify-end gap-5 flex-1">
                
                {/* Functional Search Component */}
                <NavbarSearch />
                
                <Link href="/profile" className="text-gray-900 hover:text-gray-500 transition">
                  <User className="w-5 h-5" />
                </Link>
                
                {/* Dynamic Cart Component */}
                <NavbarCartIcon />
                
              </div>

            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* Global Footer */}
        <Footer />
        
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}