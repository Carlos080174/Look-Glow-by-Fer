import React from 'react';

interface FerCosmeticLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const FerCosmeticLogo: React.FC<FerCosmeticLogoProps> = ({
  size = 'md',
  showText = true,
  theme = 'light',
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', title: 'text-lg', subtitle: 'text-[9px]' },
    md: { img: 'w-11 h-11 sm:w-12 sm:h-12', title: 'text-xl sm:text-2xl', subtitle: 'text-[10px] sm:text-[11px]' },
    lg: { img: 'w-16 h-16 sm:w-20 sm:h-20', title: 'text-2xl sm:text-3xl', subtitle: 'text-xs' },
    xl: { img: 'w-24 h-24 sm:w-28 sm:h-28', title: 'text-3xl sm:text-4xl', subtitle: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none cursor-default ${className}`}>
      {/* Logotype Image */}
      <div 
        className={`${currentSize.img} rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-xs flex-shrink-0 bg-[#F5EFE8] flex items-center justify-center cursor-default`}
      >
        <img
          src="/fer-cosmetic-logo.jpg"
          alt="Look & Glow by Fer Logotipo"
          className="w-full h-full object-cover object-center cursor-default"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-serif-luxury font-bold tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-[#24211D]'
              } ${currentSize.title}`}
            >
              Look & Glow
            </span>
            <span
              className={`font-serif-luxury font-bold tracking-wider ${
                theme === 'dark' ? 'text-[#D4AF37]' : 'text-[#8B5E3C]'
              } ${currentSize.title}`}
            >
              by Fer
            </span>
          </div>
          <span
            className={`tracking-[0.22em] uppercase font-bold mt-1 ${
              theme === 'dark' ? 'text-[#C4B7A6]' : 'text-[#7A7064]'
            } ${currentSize.subtitle}`}
          >
            Cosmética & Belleza
          </span>
        </div>
      )}
    </div>
  );
};
