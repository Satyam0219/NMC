import Link from 'next/link';
import { ShieldCheck, FlaskConical, Globe, Leaf, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#0F4C5C] font-extrabold tracking-widest uppercase text-sm mb-4 block">
            The NMC Standard
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8 max-w-4xl mx-auto">
            Redefining clinical hygiene for the modern world.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We engineer precision surface protection and skin care formulations that meet the highest global clinical standards—because true hygiene leaves no room for compromise.
          </p>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="py-20 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <FlaskConical className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Scientific Precision</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Every formulation is molecularly balanced to eliminate 99.9% of pathogens without degrading your essential surfaces.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Clinical Grade</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Trusted by healthcare facilities, our products bring hospital-level sanitization directly to your home and business.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Standards</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Manufactured in state-of-the-art facilities located in India, adhering to strict international quality control protocols.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Leaf className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Conscious</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Tough on bacteria, gentle on the planet. We use biodegradable agents and sustainable packaging wherever possible.
            </p>
          </div>

        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white border-y border-gray-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-100 aspect-square rounded-[3rem] overflow-hidden relative border border-gray-200">
                {/* Placeholder for a team/lab image - You can replace this src later */}
                <img 
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop" 
                  alt="NMC Laboratory" 
                  className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Born in the lab. <br/> Built for everyday life.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                NMC started with a simple observation: the cleaning products available to the public were either heavily diluted and ineffective, or so toxic they damaged surfaces and skin. 
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We bridged that gap. By combining industrial-strength efficacy with human-safe formulations, we've created a line of hygiene products that don't compromise. Whether you are sterilizing a clinic floor or washing your hands before dinner, you deserve precision protection.
              </p>
              
              <Link 
                href="/shop" 
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
              >
                Explore Formulations <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}