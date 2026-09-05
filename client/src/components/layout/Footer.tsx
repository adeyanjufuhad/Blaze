import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-[#222222] bg-[#111111] pt-20 pb-12 text-[#faf9f6] select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#222222]">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="lg" darkText={false} />
            <p className="text-sm text-[#999999] max-w-sm leading-relaxed font-light">
              Wood-fired artisanal pizzas baked with patience and passion. Crafted for late nights, gatherings, and the craft of real food.
            </p>
            <div className="pt-2 text-xs text-[#888888] font-medium tracking-wide">
              <span>Campus Plaza · Open Daily 11:00 AM – 02:00 AM</span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-[#faf9f6] uppercase">Menu</h4>
            <ul className="space-y-2.5 text-xs text-[#999999]">
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Signature Pizzas
                </Link>
              </li>
              <li>
                <Link to="/build" className="hover:text-white transition-colors">
                  Custom Builder
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Specials" className="hover:text-white transition-colors">
                  Chef's Specials
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Veggie" className="hover:text-white transition-colors">
                  Plant & Veggie
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-[#faf9f6] uppercase">Experience</h4>
            <ul className="space-y-2.5 text-xs text-[#999999]">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/build" className="hover:text-white transition-colors">
                  Crust & Dough Craft
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Staff & Kitchen Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-[#faf9f6] uppercase">Visit & Order</h4>
            <p className="text-xs leading-relaxed text-[#999999]">
              Blaze Flagship Kitchen<br />
              Campus Plaza, Block B<br />
              <span className="text-[#faf9f6]">contact@blazepizza.com</span>
            </p>
            <div className="pt-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#faf9f6] text-[#111111] text-xs font-medium hover:bg-[#2d5a27] hover:text-white transition-all"
              >
                <span>Order Now</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Giant Light Shadowy Brand Watermark */}
        <div className="relative w-full overflow-hidden select-none pointer-events-none my-4 sm:my-8 text-center">
          <span
            className="font-serif font-black uppercase text-[19vw] sm:text-[20vw] leading-[0.78] tracking-tight block text-[#faf9f6]/[0.06]"
            style={{
              textShadow:
                '0 0 50px rgba(250, 249, 246, 0.08), 0 0 100px rgba(250, 249, 246, 0.03)',
            }}
          >
            BLAZE
          </span>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <div>
            © {new Date().getFullYear()} Blaze. Every slice, an adventure.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">TikTok</span>
            <span className="hover:text-white cursor-pointer transition-colors">Twitter / X</span>
            <span className="hover:text-white cursor-pointer transition-colors">WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
