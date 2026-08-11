import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/junglegoldofficials", icon: <FacebookIcon /> },
  { label: "Instagram", href: "https://instagram.com/junglegoldofficials", icon: <InstagramIcon /> },
  { label: "TikTok", href: "https://tiktok.com/@junglegoldofficials", icon: <TikTokIcon /> },
  { label: "YouTube", href: "https://youtube.com/@junglegoldofficials", icon: <YoutubeIcon /> },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-gold/10 bg-forest-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand-logo.png"
              alt="Jungle Gold Raw Wild Forest Honey Logo"
              className="w-16 h-16 rounded-full object-contain transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
            />
            <div>
              <div className="font-serif text-3xl font-bold text-gold">Jungle Gold</div>
              <div className="text-cream/40 text-xs tracking-widest uppercase mt-1">Raw Wild Forest Honey</div>
            </div>
          </div>
          <p className="text-cream/70 text-sm font-medium mb-1 flex items-center gap-2">
            <span className="text-gold">🔬</span> Lab tested from PCSIR
          </p>
          <p className="text-cream/50 text-xs mb-2">
            Backed by the legacy & trust of Razzaq Pansar Store.
          </p>
          <p className="text-gold/70 text-sm italic font-serif">خالص شہد — براہ راست جنگل سے</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-lg font-bold text-cream mb-5">Get in Touch</h3>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:junglegoldofficials@gmail.com"
              className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors text-sm"
            >
              <Mail size={16} className="text-gold flex-shrink-0" />
              junglegoldofficials@gmail.com
            </a>
            <div className="flex items-center gap-3 text-cream/60 text-sm">
              <MapPin size={16} className="text-gold flex-shrink-0" />
              Gujrat, Punjab, Pakistan
            </div>
            <a
              href="https://wa.me/923240917740"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors text-sm"
            >
              <Phone size={16} className="text-gold flex-shrink-0" />
              WhatsApp Orders
            </a>
          </div>
        </div>

        {/* Social links */}
        <div>
          <h3 className="font-serif text-lg font-bold text-cream mb-5">Follow Us</h3>
          <div className="flex flex-col gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors text-sm"
              >
                <span className="text-gold">{s.icon}</span>
                @junglegoldofficials
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-cream/30 text-xs">
        <p>© {new Date().getFullYear()} Jungle Gold. All rights reserved.</p>
        <Link href="/admin" className="hover:text-gold transition-colors">
          Admin →
        </Link>
      </div>
    </footer>
  );
}
