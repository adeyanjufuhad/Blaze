import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#3a2010] bg-[#1a0a00] pt-20 pb-12 text-[#fffaf5]/80 select-none">
      {/* Giant BLAZE watermark in footer */}
      <div
        className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 -z-0 select-none overflow-hidden opacity-[0.03] text-center"
        aria-hidden="true"
      >
        <div className="text-[20vw] font-black tracking-tighter text-white uppercase leading-none">
          BLAZE
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#3a2010]">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="lg" darkText={false} />
            <p className="text-sm text-[#fffaf5]/70 max-w-sm leading-relaxed">
              Built for the bold. Delivered to your door. Fire-baked artisanal crusts, premium whole-milk mozzarella, and signature hot spices that hit different.
            </p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff4500]">
              <Flame className="w-4 h-4" />
              <span>Campus & City Delivery · Open 11am – Late</span>
            </div>
          </div>

          {/* Links Cols */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Menu</h4>
            <ul className="space-y-2 text-sm text-[#fffaf5]/70">
              <li>
                <Link to="/menu" className="hover:text-[#ff4500] transition-colors">
                  Signature Pizzas
                </Link>
              </li>
              <li>
                <Link to="/build" className="hover:text-[#ff4500] transition-colors">
                  Build Your Own
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Specials" className="hover:text-[#ff4500] transition-colors">
                  Chef's Specials
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Veggie" className="hover:text-[#ff4500] transition-colors">
                  Plant Based & Veggie
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Blaze Experience</h4>
            <ul className="space-y-2 text-sm text-[#fffaf5]/70">
              <li>
                <Link to="/orders" className="hover:text-[#ff4500] transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/build" className="hover:text-[#ff4500] transition-colors">
                  4-Step Crust Builder
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#ff4500] transition-colors text-purple-400">
                  Kitchen & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Find Us</h4>
            <p className="text-sm leading-relaxed text-[#fffaf5]/70">
              Blaze Flagship Kitchen<br />
              Campus Plaza, Block B<br />
              <span className="text-white font-bold">hello@blaze.com</span>
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff4500] text-white text-xs font-black uppercase tracking-wider hover:bg-[#e03800] transition-all shadow-lg shadow-[#ff4500]/25"
              >
                <span>Order Now</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#fffaf5]/50">
          <div>
            © {new Date().getFullYear()} Blaze Pizza. All rights reserved. Every slice, an adventure.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#ff4500] cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-[#ff4500] cursor-pointer transition-colors">TikTok</span>
            <span className="hover:text-[#ff4500] cursor-pointer transition-colors">Twitter / X</span>
            <span className="hover:text-[#ff4500] cursor-pointer transition-colors">WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
