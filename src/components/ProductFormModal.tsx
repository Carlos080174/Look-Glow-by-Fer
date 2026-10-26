import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Plus, Trash2, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { Product, CategoryId, ProductVariant } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
}

const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: 'labiales', label: 'Labiales & Cuidado Labial' },
  { id: 'rostro', label: 'Rostro & Piel' },
  { id: 'ojos', label: 'Ojos, Pestañas & Delineadores' },
  { id: 'fragancias', label: 'Fragancias & Body Mists' },
  { id: 'sets', label: 'Sets & Promociones' },
];

const PRESET_IMAGES = [
  { label: 'Duo Lip Gloss Fresa', url: '/products/ushas-lip-gloss-duo.jpg' },
  { label: 'Bálsamos Ositos Kawaii', url: '/products/ushas-bear-lip-balm.jpg' },
  { label: 'SAS Lipstick Dorado Velvet', url: '/products/sas-gold-lipstick.jpg' },
  { label: 'Lápiz Delineador Labios', url: '/products/lip-liner-pencils.jpg' },
  { label: 'SAS Polvo Traslúcido Corazón', url: '/products/sas-loose-powder.jpg' },
  { label: 'USHAS CC Cream Perfeccionadora', url: '/products/ushas-cc-cream.jpg' },
  { label: 'USHAS Base Matte 24H', url: '/products/ushas-matte-foundation.jpg' },
  { label: 'Febble Iluminador Marmoleado', url: '/products/febble-heart-highlighter.jpg' },
  { label: 'Kit 2en1 Pestañas & Delineador', url: '/products/ushas-mascara-eyeliner.jpg' },
  { label: 'V.V.LOVE Sweet Dessert con Dije', url: '/products/vvlove-sweet-dessert-mist.jpg' },
  { label: 'V.V.LOVE Luxury Noir con Lazo', url: '/products/vvlove-luxury-mist.jpg' },
  { label: 'V.V.LOVE Glam Sweet Temptation', url: '/products/vvlove-glam-mist.jpg' },
  { label: 'Logotipo Look & Glow by Fer', url: '/fer-cosmetic-logo.jpg' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = !!initialProduct;

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [brand, setBrand] = useState('Look & Glow by Fer');
  const [category, setCategory] = useState<CategoryId>('labiales');
  const [price, setPrice] = useState<string>('9.50');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [image, setImage] = useState<string>('/products/ushas-lip-gloss-duo.jpg');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [presentation, setPresentation] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [badgesText, setBadgesText] = useState('Nuevo, Calidad Premium');
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState<string>('20');
  
  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantColor, setNewVariantColor] = useState('#E28E9E');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setSubtitle(initialProduct.subtitle || '');
      setBrand(initialProduct.brand || 'Look & Glow by Fer');
      setCategory(initialProduct.category || 'labiales');
      setPrice(initialProduct.price.toString());
      setOriginalPrice(initialProduct.originalPrice ? initialProduct.originalPrice.toString() : '');
      setImage(initialProduct.image || '');
      setShortDescription(initialProduct.shortDescription || '');
      setFullDescription(initialProduct.fullDescription || '');
      setPresentation(initialProduct.presentation || '');
      setBenefitsText(initialProduct.benefits ? initialProduct.benefits.join('\n') : '');
      setBadgesText(initialProduct.badges ? initialProduct.badges.join(', ') : '');
      setInStock(initialProduct.inStock !== false);
      setStockCount(typeof initialProduct.stockCount === 'number' ? initialProduct.stockCount.toString() : '20');
      setVariants(initialProduct.variants || []);
    } else {
      // Default empty form
      setName('');
      setSubtitle('');
      setBrand('Look & Glow by Fer');
      setCategory('labiales');
      setPrice('9.50');
      setOriginalPrice('');
      setImage('/products/ushas-lip-gloss-duo.jpg');
      setShortDescription('');
      setFullDescription('');
      setPresentation('Envase de lujo aplicador');
      setBenefitsText('Fórmula humectante\nLarga duración\nTextura ligera');
      setBadgesText('Nuevo, Bestseller');
      setInStock(true);
      setStockCount('20');
      setVariants([]);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const [isCompressingImage, setIsCompressingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingImage(true);
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.82);
      setImage(compressedDataUrl);
    } catch (err) {
      console.warn('Error al procesar la imagen seleccionada:', err);
    } finally {
      setIsCompressingImage(false);
      // Reset input value so re-uploading the same file works
      e.target.value = '';
    }
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim()) return;
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      name: newVariantName.trim(),
      colorHex: newVariantColor,
    };
    setVariants([...variants, newVariant]);
    setNewVariantName('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = parseFloat(price) || 0;
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const catObj = CATEGORY_OPTIONS.find((c) => c.id === category);

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const badges = badgesText
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const productId = initialProduct?.id || `fer-prod-${Date.now()}`;

    const parsedStockCount = parseInt(stockCount, 10);
    const validStockCount = isNaN(parsedStockCount) ? 0 : Math.max(0, parsedStockCount);

    const updatedProduct: Product = {
      id: productId,
      name: name.trim(),
      subtitle: subtitle.trim() || name.trim(),
      brand: brand.trim() || 'Look & Glow by Fer',
      category,
      categoryLabel: catObj ? catObj.label : 'Cosmética & Belleza',
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      rating: initialProduct?.rating || 5.0,
      reviewCount: initialProduct?.reviewCount || 1,
      image: image.trim() || '/fer-cosmetic-logo.jpg',
      gallery: [image.trim() || '/fer-cosmetic-logo.jpg'],
      shortDescription: shortDescription.trim() || fullDescription.slice(0, 120),
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      presentation: presentation.trim() || 'Edición especial',
      benefits: benefits.length > 0 ? benefits : ['Calidad garantizada Look & Glow by Fer'],
      howToUse: initialProduct?.howToUse || 'Aplicar según preferencia para un acabado impecable.',
      badges: badges.length > 0 ? badges : ['Exclusivo'],
      inStock: inStock && validStockCount > 0,
      stockCount: validStockCount,
      variants: variants.length > 0 ? variants : undefined,
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D5C4B0] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#F5EFE8] border-b border-[#E8DCCF] flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5E3C] block">
              Look & Glow by Fer • Catálogo
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#24211D]">
              {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A7064] hover:text-[#24211D] rounded-full hover:bg-[#EAE0D3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Dúo Lip Gloss Fresa..."
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Marca
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Look & Glow by Fer / USHAS®"
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Precio de Venta (Bs.) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.50"
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Precio Anterior / Tachado (Bs.) <span className="text-[10px] text-[#7A7064] font-normal">(Opcional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="12.00"
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Subtítulo / Frase Corta
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej. Brillo labial doble acabado con aroma frutal dulce"
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>
          </div>

          {/* Product Image Section */}
          <div className="p-4 rounded-2xl bg-[#F5EFE8] border border-[#E0D5C7] space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#24211D]">
              Fotografía del Producto
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Preview */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#D5C4B0] bg-white flex-shrink-0 flex items-center justify-center shadow-xs">
                {image ? (
                  <img
                    src={image}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#A89F91]" />
                )}
              </div>

              {/* Upload & Preset Options */}
              <div className="flex-1 w-full space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A5043] mb-1">
                    URL de la Imagen o Enlace Externo:
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... o /products/..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D8CABE] rounded-xl text-xs text-[#24211D] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* File Upload Button */}
                  <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#24211D] text-white text-xs font-medium rounded-xl hover:bg-[#3D3731] transition-colors shadow-xs ${isCompressingImage ? 'opacity-70 pointer-events-none' : ''}`}>
                    {isCompressingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                        <span>Optimizando foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Subir desde computadora</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[11px] text-[#7A7064]">o elige una foto existente:</span>
                </div>

                {/* Preset badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                        image === preset.url
                          ? 'bg-[#24211D] text-white border-[#24211D]'
                          : 'bg-white text-[#5A5043] border-[#D8CABE] hover:bg-[#EAE0D3]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions & Presentation */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Descripción Corta (Tarjeta de producto)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Breve reseña del producto para la vista general..."
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Descripción Completa (Modal de detalles)
              </label>
              <textarea
                rows={3}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Detalla las características, fórmula, ingredientes y beneficios..."
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none focus:border-[#24211D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                  Presentación / Envase
                </label>
                <input
                  type="text"
                  value={presentation}
                  onChange={(e) => setPresentation(e.target.value)}
                  placeholder="Ej. Tubo con aplicador cushion, Frasco 30ml..."
                  className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={badgesText}
                  onChange={(e) => setBadgesText(e.target.value)}
                  placeholder="Bestseller, Nuevo, Oferta, Viral..."
                  className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1">
                Beneficios Clave (un beneficio por línea)
              </label>
              <textarea
                rows={3}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder="Efecto labios de cristal&#10;Fórmula ultra humectante&#10;Aroma dulce a frutas"
                className="w-full px-3.5 py-2 bg-white border border-[#D8CABE] rounded-xl text-sm text-[#24211D] focus:outline-none"
              />
            </div>
          </div>

          {/* Variants / Models */}
          <div className="p-4 rounded-2xl bg-[#F5EFE8] border border-[#E0D5C7] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#24211D]">
                Modelos / Variantes / Tonos ({variants.length})
              </label>
              <span className="text-[10px] text-[#7A7064]">Opcional</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                placeholder="Nombre del tono (Ej. Fresa Candy)"
                className="flex-1 px-3 py-1.5 bg-white border border-[#D8CABE] rounded-xl text-xs text-[#24211D] focus:outline-none"
              />
              <input
                type="color"
                value={newVariantColor}
                onChange={(e) => setNewVariantColor(e.target.value)}
                className="w-10 h-8 rounded-lg cursor-pointer bg-white p-0.5 border border-[#D8CABE]"
                title="Color del tono"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-[#24211D] text-white text-xs font-semibold rounded-xl hover:bg-[#3D3731] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>

            {variants.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D8CABE] rounded-full text-xs"
                  >
                    {v.colorHex && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span className="text-[#24211D] font-medium">{v.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="text-[#A85858] hover:text-[#7A3333] ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock availability & Quantity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-[#E0D5C7]">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="product-in-stock"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-[#24211D] rounded-sm focus:ring-[#24211D] accent-[#24211D] cursor-pointer"
              />
              <label htmlFor="product-in-stock" className="text-xs font-bold text-[#24211D] cursor-pointer">
                Producto disponible en inventario (En Stock)
              </label>
            </div>

            <div className="flex items-center gap-2 pl-7 sm:pl-0">
              <label htmlFor="product-stock-count" className="text-xs font-semibold text-[#6B5E50] whitespace-nowrap">
                Cantidad en Stock:
              </label>
              <input
                type="number"
                id="product-stock-count"
                min="0"
                value={stockCount}
                onChange={(e) => {
                  setStockCount(e.target.value);
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val === 0) {
                    setInStock(false);
                  } else if (!isNaN(val) && val > 0) {
                    setInStock(true);
                  }
                }}
                className="w-20 px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D8CABE] rounded-xl text-xs font-bold text-center text-[#24211D] focus:outline-none focus:border-[#24211D]"
                placeholder="20"
              />
              <span className="text-[11px] text-[#7A7064]">uds.</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E8DCCF] flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#D5C4B0] text-[#5A5043] rounded-full text-xs font-bold hover:bg-[#EAE0D3] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#24211D] hover:bg-[#3D3731] text-white rounded-full text-xs font-bold tracking-wider transition-colors shadow-md cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
