import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2B3440] text-[#B0B8C1] py-16 md:py-20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & About */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              {/* Fake Logo Icon matching the blue circles in the screenshot */}
              <div className="w-8 h-8 flex relative">
                <div className="w-5 h-5 rounded border-2 border-[#407BFF] absolute top-0 left-0"></div>
                <div className="w-5 h-5 rounded bg-[#407BFF] absolute bottom-0 right-0"></div>
              </div>
              <span className="text-[#407BFF] text-xl font-bold">NMC Hygiene</span>
            </div>
            <p className="text-sm leading-relaxed mb-12 max-w-xs">
              NMC is a clinical-grade hygiene brand providing precision surface and skin care located in India, serving global standards.
            </p>
            <p className="text-sm">Copyright NMC Hygiene</p>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h4 className="text-[#407BFF] text-lg font-bold mb-6">Get in Touch</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#407BFF] shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  123 Hygiene Park, Clinical Sector,<br />
                  Solapur, Maharashtra 413001
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#407BFF] shrink-0" />
                <p className="text-sm">contact@nmchygiene.com</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-[#407BFF] shrink-0" />
                <p className="text-sm">+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Column 3: Socials */}
          <div>
            <div className="flex gap-3 mb-6">
              {['In', 'Fb', 'Ig', 'Tw'].map((social) => (
                <Link key={social} href="#" className="w-10 h-10 rounded-full bg-[#407BFF] text-white flex items-center justify-center font-bold text-sm hover:bg-blue-600 transition-colors">
                  {social}
                </Link>
              ))}
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Follow us on social media for the latest clinical updates, hygiene tips, and product releases.
            </p>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-[#407BFF] text-lg font-bold mb-6">Join a Newsletter</h4>
            <p className="text-sm mb-4">Your Email</p>
            <form className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="w-full bg-[#374151] border-none text-white px-4 py-3.5 rounded focus:ring-2 focus:ring-[#407BFF] outline-none text-sm placeholder-gray-400"
              />
              <button 
                type="button"
                className="w-32 bg-[#407BFF] text-white font-semibold py-3.5 rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}