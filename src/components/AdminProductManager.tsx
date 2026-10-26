import React, { useState } from 'react';
import { 
  X, Plus, Edit2, Trash2, Search, LogOut, RotateCcw, 
  Check, AlertTriangle, ShieldCheck, Tag, DollarSign, PackageOpen, ShoppingCart, Layers, Boxes,
  BarChart3, TrendingUp
} from 'lucide-react';
import { Product, WhatsAppOrder } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminAnalyticsView } from './AdminAnalyticsView';

interface AdminProductManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefaults: () => void;
  orders: WhatsAppOrder[];
  onMarkOrderAsDelivered: (order: WhatsAppOrder) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  activeTab?: 'productos' | 'pedidos' | 'analisis';
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  isOpen,
  onClose,
  onLogout,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetToDefaults,
  orders,
  onMarkOrderAsDelivered,
  onDeleteOrder,
  activeTab: initialTab = 'productos',
}) => {
  const [currentTab, setCurrentTab] = useState<'productos' | 'pedidos' | 'analisis'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  
  // Modals inside Admin
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const pendingOrdersCount = orders.filter((o) => o.status === 'pendiente').length;

  // Calculate products with low stock (< 5 units)
  const lowStockProductsCount = products.filter((p) => {
    const stock = typeof p.stockCount === 'number' ? p.stockCount : (p.inStock ? 20 : 0);
    return stock < 5;
  }).length;

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.shortDescription.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const currentStock = typeof p.stockCount === 'number' ? p.stockCount : (p.inStock ? 20 : 0);
    const matchesLowStock = !onlyLowStock || currentStock < 5;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setProductToEdit(prod);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = (prod: Product) => {
    if (productToEdit) {
      onUpdateProduct(prod);
    } else {
      onAddProduct(prod);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D5C4B0] overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="p-4 sm:p-5 bg-[#24211D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#352F28] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] flex-shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-wide text-white">
                  Panel de Gestión • Look & Glow by Fer
                </h2>
                <span className="text-[10px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold uppercase">
                  Admin
                </span>
              </div>
              <p className="text-xs text-[#A89F91]">
                Control de inventario, stock en base de datos y pedidos por WhatsApp
              </p>
            </div>
          </div>

          {/* Navigation Tabs between Products, Orders, and Analytics */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#352F28] p-1 rounded-2xl border border-[#4A4237]">
              <button
                type="button"
                onClick={() => setCurrentTab('productos')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'productos'
                    ? 'bg-[#FAF8F5] text-[#24211D] shadow-xs'
                    : 'text-[#C4B7A6] hover:text-white'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Productos ({products.length})</span>
                {lowStockProductsCount > 0 && (
                  <span 
                    className="ml-1 px-1.5 py-0.2 bg-[#D97706] text-white text-[9px] font-black rounded-full"
                    title={`${lowStockProductsCount} productos con stock crítico (< 5)`}
                  >
                    {lowStockProductsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentTab('pedidos')}
                className={`relative px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'pedidos'
                    ? 'bg-[#D4AF37] text-[#24211D] shadow-xs'
                    : 'text-[#C4B7A6] hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Pedidos</span>
                {pendingOrdersCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-[#E11D48] text-white text-[10px] font-extrabold rounded-full animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentTab('analisis')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'analisis'
                    ? 'bg-[#8B5E3C] text-white shadow-xs'
                    : 'text-[#C4B7A6] hover:text-white'
                }`}
                title="Gráficos de ventas y productos más vendidos"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#EAD8C7]" />
                <span>Análisis</span>
              </button>
            </div>

            {currentTab === 'productos' && (
              <button
                onClick={handleOpenCreate}
                className="px-3 sm:px-4 py-2 bg-[#D4AF37] hover:bg-[#C29D26] text-[#24211D] rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Producto</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="p-2 bg-[#352F28] hover:bg-[#4A4237] text-[#C4B7A6] hover:text-white rounded-full transition-colors cursor-pointer"
              title="Cerrar sesión de administración"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#A89F91] hover:text-white rounded-full hover:bg-[#352F28] transition-colors"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {currentTab === 'productos' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Filter and Stats Bar */}
            <div className="p-4 bg-[#F5EFE8] border-b border-[#E8DCCF] flex flex-col md:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7064]" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o marca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D8CABE] rounded-xl text-xs text-[#24211D] focus:outline-none focus:border-[#24211D]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7064] hover:text-[#24211D]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category selector */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#D8CABE] rounded-xl text-xs text-[#24211D] focus:outline-none"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="labiales">Labiales & Cuidado Labial</option>
                  <option value="rostro">Rostro & Piel</option>
                  <option value="ojos">Ojos, Pestañas & Delineadores</option>
                  <option value="fragancias">Fragancias & Body Mists</option>
                  <option value="sets">Sets & Promociones</option>
                </select>

                {/* Low Stock Quick Filter Badge Button */}
                {lowStockProductsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setOnlyLowStock(!onlyLowStock)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      onlyLowStock
                        ? 'bg-[#B45309] text-white shadow-xs ring-2 ring-[#B45309]/30'
                        : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] hover:bg-[#FDE68A]'
                    }`}
                    title="Filtrar solo productos con menos de 5 unidades en stock"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Stock Crítico (&lt; 5): {lowStockProductsCount}</span>
                  </button>
                )}
              </div>

              {/* Total stats */}
              <div className="flex items-center gap-3 text-xs text-[#6B5E50] w-full md:w-auto justify-between md:justify-end">
                <span>
                  Mostrando <strong>{filtered.length}</strong> de <strong>{products.length}</strong> productos
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="text-[11px] text-[#8B5E3C] hover:text-[#24211D] flex items-center gap-1 underline transition-colors cursor-pointer"
                  title="Restaurar catálogo original"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar catálogo</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#E5DACD] p-8">
                  <div className="w-14 h-14 rounded-full bg-[#F2ECE4] text-[#8C8275] flex items-center justify-center mx-auto mb-3">
                    <PackageOpen className="w-7 h-7 stroke-1" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                    No se encontraron productos
                  </h4>
                  <p className="text-xs text-[#7A7064] mt-1 max-w-sm mx-auto">
                    {onlyLowStock
                      ? 'No hay productos con stock menor a 5 unidades.'
                      : 'No hay productos que coincidan con los filtros seleccionados o el catálogo está vacío.'}
                  </p>
                  {onlyLowStock ? (
                    <button
                      onClick={() => setOnlyLowStock(false)}
                      className="mt-4 px-4 py-2 bg-[#24211D] text-white text-xs font-bold rounded-full hover:bg-[#3D3731] transition-colors"
                    >
                      Ver Todos los Productos
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenCreate}
                      className="mt-4 px-4 py-2 bg-[#24211D] text-white text-xs font-bold rounded-full hover:bg-[#3D3731] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Agregar Primer Producto</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((product) => {
                    const currentStock = typeof product.stockCount === 'number' ? product.stockCount : (product.inStock ? 20 : 0);
                    const isLowStock = currentStock < 5;
                    const isOutOfStock = currentStock === 0 || !product.inStock;

                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-2xl p-4 shadow-xs transition-all flex flex-col justify-between relative ${
                          isOutOfStock
                            ? 'border-2 border-[#EF4444] bg-[#FFFDFD]'
                            : isLowStock
                            ? 'border-2 border-[#F59E0B] bg-[#FFFDF7] shadow-amber-50'
                            : 'border border-[#E5DACD] hover:border-[#8B5E3C]/50'
                        }`}
                      >
                        {/* Prominent Low Stock or Out of Stock Visual Badge */}
                        {isLowStock && (
                          <div 
                            className={`absolute -top-2.5 right-4 z-10 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider ${
                              isOutOfStock ? 'bg-[#DC2626]' : 'bg-[#D97706] animate-pulse'
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>{isOutOfStock ? '¡Agotado!' : `¡Stock Crítico: ${currentStock} uds!`}</span>
                          </div>
                        )}

                        {/* Top info */}
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E8DCCF] bg-[#F5EFE8] flex-shrink-0 relative">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C] block truncate">
                                {product.brand} • {product.categoryLabel}
                              </span>
                              <h4 className="text-xs font-bold text-[#24211D] line-clamp-2 leading-tight">
                                {product.name}
                              </h4>
                              
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-sm font-bold text-[#24211D]">
                                  Bs. {product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-[11px] text-[#A89F91] line-through">
                                    Bs. {product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Stock count badge */}
                              <div className="flex items-center gap-1.5 mt-1.5">
                                {isOutOfStock ? (
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#FDF2F2] text-[#9B1C1C] border border-[#FCA5A5] flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                                    <span>Agotado (0 uds.)</span>
                                  </span>
                                ) : isLowStock ? (
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] flex items-center gap-1 animate-pulse">
                                    <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                                    <span>Bajo Stock ({currentStock} uds.)</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EA] text-[#2E6B3B] flex items-center gap-1">
                                    <span>En Stock</span>
                                    <span className="font-mono font-extrabold">({currentStock} uds.)</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Subtitle & Badges */}
                          <p className="text-[11px] text-[#6B5E50] line-clamp-2 mb-2 leading-relaxed">
                            {product.shortDescription || product.subtitle}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.badges.slice(0, 3).map((b, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] bg-[#F5EFE8] text-[#5A5043] px-2 py-0.5 rounded-full font-medium"
                              >
                                {b}
                              </span>
                            ))}
                            {product.variants && product.variants.length > 0 && (
                              <span className="text-[9px] bg-[#FAF3E0] text-[#8B5E3C] px-2 py-0.5 rounded-full font-semibold">
                                {product.variants.length} variantes
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2ECE4]">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            className="px-3 py-1.5 rounded-xl border border-[#D5C4B0] hover:bg-[#F5EFE8] text-[#24211D] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#8B5E3C]" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="px-3 py-1.5 rounded-xl border border-[#F5C2C7] hover:bg-[#FDF2F2] text-[#9B1C1C] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP ORDERS MANAGEMENT */}
        {currentTab === 'pedidos' && (
          <AdminOrdersManager
            orders={orders}
            products={products}
            onMarkAsDelivered={onMarkOrderAsDelivered}
            onDeleteOrder={onDeleteOrder}
          />
        )}

        {/* TAB 3: SALES & BEST SELLING PRODUCTS ANALYTICS */}
        {currentTab === 'analisis' && (
          <AdminAnalyticsView
            orders={orders}
            products={products}
          />
        )}

        {/* Footer info with shortcut note */}
        <div className="p-3 sm:p-4 bg-[#F5EFE8] border-t border-[#E8DCCF] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A7064] gap-2 flex-shrink-0">
          <span>
            💡 Presiona <kbd className="px-1.5 py-0.5 bg-white border border-[#D5C4B0] rounded-sm text-[#24211D] font-mono font-bold">CTRL + Y</kbd> en cualquier momento para volver a abrir este panel.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#24211D] text-white rounded-full font-bold hover:bg-[#3D3731] transition-colors cursor-pointer"
          >
            Listo, Salir al Catálogo
          </button>
        </div>

      </div>

      {/* Delete product confirmation dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-sm w-full border border-[#D5C4B0] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F2] text-[#9B1C1C] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                ¿Eliminar este producto?
              </h3>
              <p className="text-xs text-[#6B5E50] mt-1">
                Se removerá <strong className="text-[#24211D]">"{productToDelete.name}"</strong> del catálogo y de la base de datos.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-full border border-[#D5C4B0] text-xs font-bold text-[#5A5043] hover:bg-[#EAE0D3]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-full bg-[#9B1C1C] hover:bg-[#7A1616] text-white text-xs font-bold shadow-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {confirmReset && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-sm w-full border border-[#D5C4B0] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFFBEB] text-[#B45309] flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                ¿Restaurar catálogo oficial?
              </h3>
              <p className="text-xs text-[#6B5E50] mt-1">
                Esto restaurará los productos predeterminados de Look & Glow by Fer en tu base de datos.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-full border border-[#D5C4B0] text-xs font-bold text-[#5A5043] hover:bg-[#EAE0D3]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetToDefaults();
                  setConfirmReset(false);
                }}
                className="flex-1 py-2 rounded-full bg-[#24211D] hover:bg-[#3D3731] text-white text-xs font-bold shadow-xs"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={productToEdit}
      />

    </div>
  );
};
