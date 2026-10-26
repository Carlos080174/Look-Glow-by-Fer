import React from 'react';
import { Star, Plus, Check, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  isInCart,
}) => {
  return (
    <div className="group relative bg-[#FAF8F5] rounded-3xl border border-[#E5DACD] hover:border-[#8B5E3C] transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden">
      
      {/* Top Media / Thumbnail */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-[#F2ECE4] cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badges.slice(0, 2).map((badge, idx) => (
            <span
              key={idx}
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-xs ${
                idx === 0
                  ? 'bg-[#24211D] text-white'
                  : 'bg-[#FAF8F5]/90 backdrop-blur-xs text-[#8B5E3C] border border-[#E0D5C7]'
              }`}
            >
              {badge}
            </span>
          ))}
          {product.originalPrice && (
            <span className="bg-[#B91C1C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
              OFERTA
            </span>
          )}
        </div>

        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-4 py-2 bg-[#FAF8F5]/95 text-[#24211D] rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver detalles</span>
          </span>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5">
              {product.stockCount !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  product.inStock && product.stockCount > 0
                    ? 'bg-[#E8F3EA] text-[#2E6B3B]'
                    : 'bg-[#FDF2F2] text-[#9B1C1C]'
                }`}>
                  {product.inStock && product.stockCount > 0 ? `${product.stockCount} en stock` : 'Agotado'}
                </span>
              )}
              <span className="text-[10px] text-[#7A7064] bg-[#F2ECE4] px-2 py-0.5 rounded-md">
                {product.categoryLabel}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif-luxury text-base sm:text-lg font-bold text-[#24211D] hover:text-[#8B5E3C] cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Subtitle / Short description */}
          <p className="text-xs text-[#6B5E50] mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Rating and Price row */}
        <div className="mt-4 pt-3 border-t border-[#F0E6D8]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-[11px] text-[#7A7064]">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'opacity-40'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#24211D] ml-0.5">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="text-right">
              {product.originalPrice && (
                <span className="text-[11px] text-[#9E9486] line-through block leading-none">
                  Bs. {product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="font-bold text-base text-[#24211D]">
                Bs. {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to Cart action button */}
          <button
            onClick={() => onAddToCart(product)}
            className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isInCart
                ? 'bg-[#4E7756] text-white hover:bg-[#3E6244]'
                : 'bg-[#24211D] hover:bg-[#3D3731] text-white shadow-xs'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>En tu pedido (+1)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir al pedido</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
