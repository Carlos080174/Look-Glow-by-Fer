import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CategoryId, CartItem, WhatsAppOrder } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminProductManager } from './components/AdminProductManager';
import { Check, Sparkles, ShoppingBag } from 'lucide-react';
import { smoothScrollTo } from './utils/scroll';
import { 
  seedInitialProductsIfNeeded, 
  subscribeToProducts, 
  subscribeToOrders, 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  createWhatsAppOrderInFirestore,
  markOrderAsDeliveredInFirestore, 
  deleteOrderFromFirestore 
} from './services/firestoreService';
import {
  saveProductsSafely,
  loadProductsSafely,
  saveOrdersSafely,
  loadOrdersSafely,
  saveCartSafely,
  loadCartSafely
} from './utils/safeStorage';

export default function App() {
  // Products state backed by Firestore and cached safely in localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = loadProductsSafely();
    if (saved && saved.length > 0) {
      return saved;
    }
    return PRODUCTS.map((p) => ({
      ...p,
      stockCount: p.stockCount ?? 20,
      inStock: p.inStock ?? true,
    }));
  });

  // Orders state backed by Firestore and safe localStorage
  const [orders, setOrders] = useState<WhatsAppOrder[]>(() => {
    return loadOrdersSafely();
  });

  // Initialize Firestore and real-time listeners
  useEffect(() => {
    // 1. Seed initial products if collection is empty
    seedInitialProductsIfNeeded().catch((err) => {
      console.warn('Firestore seeding notice:', err);
    });

    // 2. Real-time products subscription
    const unsubscribeProducts = subscribeToProducts((firestoreProducts) => {
      if (firestoreProducts && firestoreProducts.length > 0) {
        setProducts(firestoreProducts);
        saveProductsSafely(firestoreProducts);
      }
    });

    // 3. Real-time orders subscription
    const unsubscribeOrders = subscribeToOrders((firestoreOrders) => {
      setOrders((prevOrders) => {
        const firestoreIds = new Set(firestoreOrders.map((o) => o.id));
        const unsyncedLocal = prevOrders.filter((o) => !firestoreIds.has(o.id));
        
        // Push any unsynced local orders to Firestore so they are properly registered
        if (unsyncedLocal.length > 0) {
          unsyncedLocal.forEach((localOrder) => {
            createWhatsAppOrderInFirestore(localOrder).catch(() => {});
          });
        }

        const mergedOrders = [...firestoreOrders, ...unsyncedLocal];
        saveOrdersSafely(mergedOrders);
        return mergedOrders;
      });
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  // Save products whenever updated locally as backup
  useEffect(() => {
    saveProductsSafely(products);
  }, [products]);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fer_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState<boolean>(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc'>('destacados');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Cart with local storage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return loadCartSafely();
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveCartSafely(cartItems);
  }, [cartItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Keyboard shortcut listener for CTRL + Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isY = e.key === 'y' || e.key === 'Y' || e.code === 'KeyY';
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && isY) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminManagerOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Admin auth handlers
  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      sessionStorage.setItem('fer_admin_auth', 'true');
    } catch {
      // ignore
    }
    setIsLoginModalOpen(false);
    setIsAdminManagerOpen(true);
    showToast('Acceso concedido al panel de administración');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('fer_admin_auth');
    } catch {
      // ignore
    }
    setIsAdminManagerOpen(false);
    showToast('Sesión de administración cerrada');
  };

  // CRUD Product handlers (synced with Firestore)
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Producto guardado: ${newProduct.name}`);
    try {
      await saveProductToFirestore(newProduct);
    } catch (err) {
      console.warn('Firestore product save note:', err);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    // Keep cart item product data in sync
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === updatedProduct.id
          ? { ...item, product: updatedProduct }
          : item
      )
    );
    showToast(`Producto actualizado: ${updatedProduct.name}`);
    try {
      await saveProductToFirestore(updatedProduct);
    } catch (err) {
      console.warn('Firestore product update note:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const toDelete = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Remove from cart if present
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
    showToast(`Producto eliminado: ${toDelete?.name || ''}`);
    try {
      await deleteProductFromFirestore(productId);
    } catch (err) {
      console.warn('Firestore product delete note:', err);
    }
  };

  const handleResetToDefaults = async () => {
    const resetProducts = PRODUCTS.map((p) => ({
      ...p,
      stockCount: p.stockCount ?? 20,
      inStock: p.inStock ?? true,
    }));
    setProducts(resetProducts);
    showToast('Restaurando catálogo en la base de datos...');
    for (const prod of resetProducts) {
      try {
        await saveProductToFirestore(prod);
      } catch {
        // ignore
      }
    }
    showToast('Catálogo oficial restablecido con éxito');
  };

  // Orders and Stock deduction handler
  const handleMarkOrderAsDelivered = async (order: WhatsAppOrder) => {
    try {
      const result = await markOrderAsDeliveredInFirestore(order, products);
      if (result.success && result.updatedProducts) {
        setProducts(result.updatedProducts);
      }
      // Update local orders list immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: 'entregado', stockDeducted: true } : o))
      );
      showToast(`Pedido ${order.orderNumber} marcado como entregado. Stock descontado.`);
    } catch (err) {
      console.warn('Firestore order delivery note (using local deduction):', err);
      // Fallback local deduction
      const updatedProds = [...products];
      for (const it of order.items) {
        const pIdx = updatedProds.findIndex((p) => p.id === it.productId);
        if (pIdx !== -1) {
          const currentStock = updatedProds[pIdx].stockCount ?? 20;
          const newStock = Math.max(0, currentStock - it.quantity);
          updatedProds[pIdx] = {
            ...updatedProds[pIdx],
            stockCount: newStock,
            inStock: newStock > 0,
          };
        }
      }
      setProducts(updatedProds);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: 'entregado', stockDeducted: true } : o))
      );
      showToast(`Pedido ${order.orderNumber} entregado (actualización local)`);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderFromFirestore(orderId);
    } catch (err) {
      console.warn('Could not delete from firestore, updating locally:', err);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Pedido eliminado del registro');
  };

  const handleOrderCreated = (newOrder: WhatsAppOrder) => {
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    showToast(`¡Pedido ${newOrder.orderNumber} registrado!`);
  };

  // Cart handlers
  const handleAddToCart = (product: Product, quantity = 1, variant?: string) => {
    setCartItems((prev) => {
      const variantName = variant || (product.variants && product.variants.length > 0 ? product.variants[0].name : undefined);
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedVariant === variantName
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === variantName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variantName }];
    });
    showToast(`¡Añadido a tu pedido! (${product.name})`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setSortBy('destacados');
  };

  const hasActiveFilters = selectedCategory !== 'todos' || searchQuery.trim() !== '';

  // Filter and sort products based on current products state
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'todos') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.shortDescription.toLowerCase().includes(q) || p.fullDescription.toLowerCase().includes(q);
        const brandMatch = p.brand.toLowerCase().includes(q);
        return nameMatch || descMatch || brandMatch;
      });
    }

    // Sort
    switch (sortBy) {
      case 'precio-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'precio-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'destacados':
      default:
        list.sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToCatalog = () => {
    smoothScrollTo('catalogo-section');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#24211D]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#24211D] text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-3 border border-[#4A4237] animate-in fade-in slide-in-from-bottom-3">
          <div className="w-5 h-5 rounded-full bg-[#4E7756] text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with category navigation and smooth scroll */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={() => (isAdminLoggedIn ? setIsAdminManagerOpen(true) : setIsLoginModalOpen(true))}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onExploreCatalog={scrollToCatalog}
      />

      {/* Hero Showcase of the 3 product collections */}
      <Hero
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onExploreCatalog={scrollToCatalog}
        onOpenAdmin={() => (isAdminLoggedIn ? setIsAdminManagerOpen(true) : setIsLoginModalOpen(true))}
      />

      {/* Main Catalog View */}
      <main id="catalogo-section" className="flex-1 py-12 sm:py-16 scroll-mt-28 sm:scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Colección en Venta
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#24211D] tracking-tight">
                Catálogo de Productos
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E50] max-w-md">
              Haz clic en cualquier producto para ver todas sus variantes, características o hacer tu pedido directo.
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResults={filteredProducts.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#F4EFEA] rounded-3xl border border-[#E5DACD] p-8">
              <div className="w-14 h-14 rounded-full bg-[#FAF8F5] text-[#8C8275] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#24211D] mb-1">
                No se encontraron productos
              </h3>
              <p className="text-xs text-[#6B5E50] max-w-md mx-auto mb-6 leading-relaxed">
                Prueba con otros términos de búsqueda o restablece los filtros para ver la colección completa.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#24211D] text-white text-xs font-semibold rounded-full hover:bg-[#3D3731] transition-colors cursor-pointer"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  isInCart={cartItems.some((item) => item.product.id === product.id)}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Simple Clean Footer */}
      <Footer onOpenAdmin={() => (isAdminLoggedIn ? setIsAdminManagerOpen(true) : setIsLoginModalOpen(true))} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isInCart={cartItems.some((item) => item.product.id === selectedProduct.id)}
        />
      )}

      {/* Shopping Bag / Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
      />

      {/* Admin Login Modal (Triggered by CTRL + Y) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Product & Orders Manager Panel (CRUD & Inventory Stock) */}
      <AdminProductManager
        isOpen={isAdminManagerOpen}
        onClose={() => setIsAdminManagerOpen(false)}
        onLogout={handleAdminLogout}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetToDefaults={handleResetToDefaults}
        orders={orders}
        onMarkOrderAsDelivered={handleMarkOrderAsDelivered}
        onDeleteOrder={handleDeleteOrder}
      />

    </div>
  );
}
