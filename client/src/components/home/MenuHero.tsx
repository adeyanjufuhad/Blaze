import React from 'react';

export const MenuHero: React.FC = () => {
  return (
    <section className="menu-hero border-y border-[#e8e4dd] select-none">
      <div className="menu-hero-text">
        {/* Letter O */}
        <span
          className="clip-letter clip-letter-1"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400)',
          }}
        >
          O
        </span>

        {/* Divider after O */}
        <span className="letter-divider" style={{ height: '58%' }} />

        {/* Letter U */}
        <span
          className="clip-letter clip-letter-2"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400)',
          }}
        >
          U
        </span>

        {/* Letter R */}
        <span
          className="clip-letter clip-letter-3"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400)',
          }}
        >
          R
        </span>

        {/* Divider after R */}
        <span className="letter-divider" style={{ height: '64%' }} />

        {/* Space between OUR and MENU */}
        <span className="clip-space" />

        {/* Letter M */}
        <span
          className="clip-letter clip-letter-4"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400)',
          }}
        >
          M
        </span>

        {/* Divider after M */}
        <span className="letter-divider" style={{ height: '52%' }} />

        {/* Letter E */}
        <span
          className="clip-letter clip-letter-5"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400)',
          }}
        >
          E
        </span>

        {/* Letter N */}
        <span
          className="clip-letter clip-letter-6"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1548369937-47519962c11a?w=400)',
          }}
        >
          N
        </span>

        {/* Divider after N */}
        <span className="letter-divider" style={{ height: '60%' }} />

        {/* Letter U */}
        <span
          className="clip-letter clip-letter-7"
          style={{
            ['--img' as any]: 'url(https://images.unsplash.com/photo-1560717845-968823efbee1?w=400)',
          }}
        >
          U
        </span>
      </div>

      {/* Cursive handwritten overlay */}
      <div className="handwritten-overlay">
        Fuel for the<br />Pizza Grind
      </div>
    </section>
  );
};

export default MenuHero;
