import React, { useRef } from 'react';
import { Sparkles, ArrowDown, Heart, ShieldCheck, Truck } from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { smoothScrollTo } from '../utils/scroll';

interface HeroProps {
  onSelectCategory: (cat: CategoryId) => void;
  onExploreCatalog: () => void;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory, onExploreCatalog, onOpenAdmin }) => {
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleCategoryClick = (cat: CategoryId) => {
    onSelectCategory(cat);
    smoothScrollTo('catalogo-section');
  };

  const handleExplore = () => {
    onExploreCatalog();
    smoothScrollTo('catalogo-section');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      clickCountRef.current = 0;
      if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
      onOpenAdmin?.();
      return;
    }

    clickCountRef.current += 1;
    if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin?.();
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 550);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-[#F7F1E8] via-[#F4EDE2] to-[#FAF8F5] pt-10 pb-14 border-b border-[#E8DCCF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          {/* Official Store Badge & Logo */}
          <div 
            onClick={handleLogoClick}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#D5C4B0] shadow-xs mb-5 select-none cursor-default"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D4AF37] flex-shrink-0 cursor-default">
              <img
                src="/fer-cosmetic-logo.jpg"
                alt="Look & Glow by Fer"
                className="w-full h-full object-cover cursor-default"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif-luxury font-bold text-xs tracking-wider text-[#24211D] cursor-default">
              Look & Glow by Fer
            </span>
            <span className="text-[#8B5E3C] text-[11px] font-medium cursor-default">• Catálogo Oficial</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#24211D] tracking-tight leading-[1.15] mb-4">
            Catálogo de Belleza, Rostro, Labiales & Fragancias
          </h1>

          <p className="text-sm sm:text-base text-[#6B5E50] max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra colección completa: bálsamos ositos kawaii, labiales velvet, polvos traslúcidos en corazón, bases mate 24H y fragancias con dijes coleccionables.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mt-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="hero-btn-explore"
                onClick={handleExplore}
                className="px-6 py-3 bg-[#24211D] hover:bg-[#3D3731] text-white rounded-full text-xs sm:text-sm font-bold tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Quick category navigation pills in Hero */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
              <span className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider mr-1">
                Categorías:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`hero-category-${cat.id}`}
                  onClick={() => handleCategoryClick(cat.id as CategoryId)}
                  className="text-xs px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#24211D] text-[#5A5043] hover:text-white border border-[#E0D5C7] hover:border-[#24211D] transition-all cursor-pointer font-medium shadow-2xs"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Featured Visual Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          
          {/* Card 1: Labiales & Gloss */}
          <div
            id="hero-card-labiales-gloss"
            onClick={() => handleCategoryClick('labiales')}
            className="group relative bg-[#FAF8F5] rounded-3xl p-4 border border-[#E0D5C7] hover:border-[#8B5E3C] transition-all hover:shadow-lg cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F2ECE4] mb-3">
              <img
                src="/products/ushas-bear-lip-balm.jpg"
                alt="Labiales y Bálsamos Ositos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#24211D]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Labiales & Gloss
              </div>
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#24211D] group-hover:text-[#8B5E3C] transition-colors">
              Labiales & Bálsamos
            </h3>
            <p className="text-xs text-[#7A7064] mt-1 line-clamp-2">
              Bálsamos osito kawaii, labiales velvet bala dorada y brillos aroma a fresa.
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-bold text-[#8B5E3C]">
              <span>Desde Bs. 4.00</span>
              <span className="text-[11px] underline flex items-center gap-1">Ver labiales →</span>
            </div>
          </div>

          {/* Card 2: Rostro & Piel */}
          <div
            id="hero-card-rostro-piel"
            onClick={() => handleCategoryClick('rostro')}
            className="group relative bg-[#FAF8F5] rounded-3xl p-4 border border-[#E0D5C7] hover:border-[#8B5E3C] transition-all hover:shadow-lg cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F2ECE4] mb-3">
              <img
                src="/products/sas-loose-powder.jpg"
                alt="Polvo Corazón y Rostro"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#D4AF37] text-[#24211D] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Rostro & Piel
              </div>
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#24211D] group-hover:text-[#8B5E3C] transition-colors">
              Polvos & Bases 24H
            </h3>
            <p className="text-xs text-[#7A7064] mt-1 line-clamp-2">
              Polvo traslúcido corazón con puff, bases mate 24h, CC Cream e iluminadores.
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-bold text-[#8B5E3C]">
              <span>Desde Bs. 8.50</span>
              <span className="text-[11px] underline flex items-center gap-1">Ver rostro →</span>
            </div>
          </div>

          {/* Card 3: Fragancias & Body Mists */}
          <div
            id="hero-card-fragancias"
            onClick={() => handleCategoryClick('fragancias')}
            className="group relative bg-[#FAF8F5] rounded-3xl p-4 border border-[#E0D5C7] hover:border-[#8B5E3C] transition-all hover:shadow-lg cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F2ECE4] mb-3">
              <img
                src="/products/vvlove-sweet-dessert-mist.jpg"
                alt="Fragancias y Body Mists"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#24211D]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Fragancias
              </div>
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#24211D] group-hover:text-[#8B5E3C] transition-colors">
              Fragancias & Body Mists
            </h3>
            <p className="text-xs text-[#7A7064] mt-1 line-clamp-2">
              Splash de 250ml con dijes colgantes de postre, Lovely Cherry y Sweet Temptation.
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-bold text-[#8B5E3C]">
              <span>Desde Bs. 16.00</span>
              <span className="text-[11px] underline flex items-center gap-1">Ver fragancias →</span>
            </div>
          </div>

          {/* Card 4: Ojos & Pestañas */}
          <div
            id="hero-card-ojos-mascara"
            onClick={() => handleCategoryClick('ojos')}
            className="group relative bg-[#FAF8F5] rounded-3xl p-4 border border-[#E0D5C7] hover:border-[#8B5E3C] transition-all hover:shadow-lg cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F2ECE4] mb-3">
              <img
                src="/products/ushas-mascara-eyeliner.jpg"
                alt="USHAS Kit 2 en 1 Máscara y Delineador Corazón"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#24211D]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Ojos & Mirada
              </div>
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#24211D] group-hover:text-[#8B5E3C] transition-colors">
              Ojos, Máscara & Delineador
            </h3>
            <p className="text-xs text-[#7A7064] mt-1 line-clamp-2">
              Kit 2en1 máscara pestañas + lápiz y delineador líquido mango corazón plateado.
            </p>
            <div className="mt-3 pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-bold text-[#8B5E3C]">
              <span>Desde Bs. 7.50</span>
              <span className="text-[11px] underline flex items-center gap-1">Ver ojos →</span>
            </div>
          </div>

        </div>

        {/* Value props badges */}
        <div className="mt-10 pt-8 border-t border-[#E8DCCF] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs text-[#6B5E50]">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-[#8B5E3C]" />
            <span className="font-semibold">Envíos rápidos y seguros</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
            <span className="font-semibold">100% Productos Originales USHAS®</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-[#8B5E3C]" />
            <span className="font-semibold">Atención y pedidos por WhatsApp</span>
          </div>
        </div>

      </div>
    </section>
  );
};
