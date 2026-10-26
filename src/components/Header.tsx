import React, { useState, useRef } from 'react';
import { Sparkles, ShoppingBag, Search, MessageCircle, X, ChevronRight } from 'lucide-react';
import { FerCosmeticLogo } from './FerCosmeticLogo';
import { getWhatsAppUrl } from '../constants/contact';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';
import { smoothScrollTo } from '../utils/scroll';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin?: () => void;
  selectedCategory?: CategoryId;
  onSelectCategory?: (category: CategoryId) => void;
  onExploreCatalog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  selectedCategory = 'todos',
  onSelectCategory,
  onExploreCatalog,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Native triple click detection
    if (e.detail === 3) {
      clickCountRef.current = 0;
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
      onOpenAdmin?.();
      return;
    }

    // Accumulate clicks within 600ms threshold
    clickCountRef.current += 1;
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin?.();
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        if (clickCountRef.current === 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        clickCountRef.current = 0;
      }, 550);
    }
  };

  const handleCategoryNavClick = (catId: CategoryId) => {
    onSelectCategory?.(catId);
    smoothScrollTo('catalogo-section');
  };

  const handleCatalogNavClick = () => {
    if (onExploreCatalog) {
      onExploreCatalog();
    } else {
      smoothScrollTo('catalogo-section');
    }
  };

  const handleWhatsAppContact = () => {
    const text = '¡Hola Look & Glow by Fer! Me gustaría consultar sobre los productos de maquillaje y cuidado labial disponibles en el catálogo.';
    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EADFCF] transition-all">
      {/* Top micro banner */}
      <div className="bg-[#24211D] text-[#FAF8F5] text-xs py-2 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-3">
        <button
          onClick={handleCatalogNavClick}
          className="inline-flex items-center gap-1.5 text-xs hover:text-[#D4AF37] transition-colors cursor-pointer"
          title="Ir al catálogo"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Look & Glow by Fer • Catálogo Oficial de Belleza • Envíos a Todo el País</span>
        </button>
        <span className="hidden sm:inline text-[#7A7064]">|</span>
        <span className="hidden sm:inline text-[#E8DCCF] text-xs">
          Atención personalizada y pedidos directos
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo with FC Monogram & Title (Triple-click secret admin entry with default arrow pointer) */}
          <div 
            id="brand-logo"
            className="flex items-center select-none flex-shrink-0 cursor-default"
            onClick={handleLogoClick}
          >
            <FerCosmeticLogo size="md" theme="light" className="cursor-default" />
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div
              className={`relative flex items-center bg-[#F4EFEA] border rounded-full transition-all px-3.5 py-2 ${
                searchFocused
                  ? 'border-[#24211D] shadow-xs bg-[#FAF8F5]'
                  : 'border-[#DFD3C4] hover:border-[#BCAFA0]'
              }`}
            >
              <Search className="w-4 h-4 text-[#8C8275] flex-shrink-0 mr-2" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Buscar brillo, bálsamo, máscara, delineador..."
                className="w-full bg-transparent border-none text-xs sm:text-sm text-[#24211D] placeholder-[#9E9486] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 text-[#8C8275] hover:text-[#24211D] rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* WhatsApp direct order link */}
            <button
              id="whatsapp-contact-btn"
              onClick={handleWhatsAppContact}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Contactar por WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#24211D] hover:bg-[#3D3731] text-white flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
              aria-label="Abrir bolsa de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-[#24211D] font-bold text-[11px] rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Navigation & Categories Bar with Smooth Scroll */}
      <nav 
        id="header-category-nav"
        aria-label="Navegación de categorías" 
        className="border-t border-[#EAE0D3] bg-[#F7F2EB]/95 backdrop-blur-xs px-4 sm:px-6 lg:px-8 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`nav-cat-${cat.id}`}
                  onClick={() => handleCategoryNavClick(cat.id as CategoryId)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#24211D] text-white shadow-xs'
                      : 'text-[#5A5043] hover:text-[#24211D] hover:bg-[#EAE0D3]/80'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            id="nav-btn-explore-catalog"
            onClick={handleCatalogNavClick}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#8B5E3C] hover:text-[#5C3D26] transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 pl-2"
          >
            <span>Ver Catálogo Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
};
