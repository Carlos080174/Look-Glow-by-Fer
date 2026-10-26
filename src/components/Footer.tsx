import React, { useRef } from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Truck, Heart } from 'lucide-react';
import { FerCosmeticLogo } from './FerCosmeticLogo';
import { getWhatsAppUrl, STORE_PHONE_DISPLAY } from '../constants/contact';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

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

  const handleWhatsApp = () => {
    const text = '¡Hola Look & Glow by Fer! Me gustaría hacer una consulta sobre el catálogo de productos.';
    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <footer className="bg-[#24211D] text-[#FAF8F5] pt-14 pb-10 border-t border-[#3D3731]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-[#3D3731]">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div onClick={handleLogoClick} className="inline-block cursor-default select-none">
              <FerCosmeticLogo size="md" theme="dark" className="cursor-default" />
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed max-w-sm pt-2">
              Catálogo oficial de productos de belleza, maquillaje y cuidado labial Look & Glow by Fer. Seleccionamos las mejores fórmulas y los empaques más adorables para consentir tu piel.
            </p>
          </div>

          {/* Guarantees & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Garantía de Calidad
            </h4>
            <ul className="space-y-2 text-xs text-[#A89F91]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Productos 100% Originales y Sellados</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Envíos rápidos con embalaje acolchado</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#D4AF37]" />
                <span>Atención personalizada y asesoría</span>
              </li>
            </ul>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atención & Pedidos
            </h4>
            <p className="text-xs text-[#A89F91]">
              ¿Tienes preguntas o deseas realizar un pedido mayorista o por encargo? Escríbenos directamente por WhatsApp.
            </p>
            <div className="pt-1">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {STORE_PHONE_DISPLAY}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A7064]">
          <p>© {new Date().getFullYear()} Look & Glow by Fer. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <span>Envíos Nacionales</span>
            <span>•</span>
            <span>Cuidado y Maquillaje</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-[#554D43] hover:text-[#D4AF37] transition-colors p-1 cursor-pointer"
                  title="Acceso Administrativo (Ctrl+Y)"
                  aria-label="Acceso Administrativo"
                >
                  <span className="text-[10px] opacity-70 hover:opacity-100">Gestión</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
