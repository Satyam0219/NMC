import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"; // Import the component
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAFA] min-h-screen flex flex-col text-gray-900`}>
        
        {/* Pass the isAdmin status as a prop! */}
        <Navbar isAdmin={isAdmin} />

        <div className="flex-grow">
          {children}
        </div>
        
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}