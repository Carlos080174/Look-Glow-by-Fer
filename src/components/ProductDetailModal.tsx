import React, { useState } from 'react';
import { X, Star, Plus, Minus, Check, MessageCircle, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { getWhatsAppUrl } from '../constants/contact';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
  isInCart: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].name : ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleDirectWhatsApp = () => {
    const variantInfo = selectedVariant ? ` (Variante: ${selectedVariant})` : '';
    const text = `¡Hola Look & Glow by Fer! Me interesa pedir el siguiente producto:\n\n• *Producto:* ${product.name}${variantInfo}\n• *Cantidad:* ${quantity}\n• *Precio unitario:* Bs. ${product.price.toFixed(2)}\n• *Total estimado:* Bs. ${(product.price * quantity).toFixed(2)}\n\n¿Tienen disponibilidad para envío? ¡Muchas gracias!`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E0D5C7] overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FAF8F5]/90 hover:bg-[#E8DFC0] text-[#24211D] border border-[#E0D5C7] transition-colors shadow-xs"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#F2ECE4] relative overflow-hidden flex items-center justify-center min-h-[280px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
            {product.badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-[#24211D]/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
          <div>
            {/* Brand & Category */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-widest mb-1">
              <span>{product.brand}</span>
              <span>•</span>
              <span className="text-[#7A7064]">{product.categoryLabel}</span>
            </div>

            {/* Title */}
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#24211D] leading-tight mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 text-xs text-[#7A7064]">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'opacity-40'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#24211D]">{product.rating}</span>
              <span>({product.reviewCount} opiniones verificadas)</span>
            </div>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-3 mb-5 p-3 rounded-2xl bg-[#F4EFEA] border border-[#E5DACD]">
              <span className="text-2xl sm:text-3xl font-bold text-[#24211D]">
                Bs. {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#9E9486] line-through">
                  Bs. {product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className={`ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                product.inStock && (product.stockCount === undefined || product.stockCount > 0)
                  ? 'text-[#2E6B3B] bg-[#E8F3EA]'
                  : 'text-[#9B1C1C] bg-[#FDF2F2]'
              }`}>
                {product.inStock && (product.stockCount === undefined || product.stockCount > 0)
                  ? `${product.stockCount ?? 20} unidades en Stock`
                  : 'Agotado'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed mb-5">
              {product.fullDescription}
            </p>

            {/* Variants selection if available */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5E50] mb-2">
                  Elige tu modelo / variante: <span className="text-[#24211D]">{selectedVariant}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedVariant === v.name
                          ? 'border-[#24211D] bg-[#24211D] text-white shadow-xs'
                          : 'border-[#D8CABE] bg-[#FAF8F5] text-[#5A5043] hover:border-[#8B5E3C]'
                      }`}
                    >
                      {v.colorHex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Presentation & Benefits */}
            <div className="space-y-3 mb-6 bg-[#F8F4EE] p-4 rounded-2xl border border-[#EADBCC]">
              <div className="text-xs">
                <span className="font-bold text-[#24211D]">Presentación: </span>
                <span className="text-[#5A5043]">{product.presentation}</span>
              </div>
              <div>
                <span className="font-bold text-xs text-[#24211D] block mb-1.5">
                  Beneficios clave:
                </span>
                <ul className="space-y-1 text-xs text-[#5A5043]">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Footer actions: Quantity + Buttons */}
          <div className="pt-4 border-t border-[#E8DCCF] space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center bg-[#F2ECE4] rounded-full border border-[#D5C7B5] px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-[#5A5043] hover:text-[#24211D] rounded-full"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#24211D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-[#5A5043] hover:text-[#24211D] rounded-full"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#24211D] hover:bg-[#3D3731] text-white rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>¡Añadido a tu pedido!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Añadir al Pedido (Bs. ${(product.price * quantity).toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp button */}
            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir directamente por WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
