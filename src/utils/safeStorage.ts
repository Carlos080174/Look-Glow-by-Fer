import { Product, WhatsAppOrder, CartItem } from '../types';

const PRODUCTS_KEY = 'fer_cosmetic_products';
const ORDERS_KEY = 'fer_cosmetic_orders';
const CART_KEY = 'fer_cosmetic_cart';

/**
 * Sanitize products for local storage:
 * Replaces huge base64 data URLs with a fallback image path in the local storage cache
 * so local storage never exceeds quota, while Firestore and React memory hold the full data.
 */
function sanitizeProductsForStorage(products: Product[]): Product[] {
  return products.map((product) => {
    let sanitizedImage = product.image;
    if (sanitizedImage && sanitizedImage.startsWith('data:image/') && sanitizedImage.length > 5000) {
      sanitizedImage = '/fer-cosmetic-logo.jpg';
    }

    let sanitizedGallery = product.gallery;
    if (sanitizedGallery && Array.isArray(sanitizedGallery)) {
      sanitizedGallery = sanitizedGallery.map((img) =>
        img && img.startsWith('data:image/') && img.length > 5000 ? '/fer-cosmetic-logo.jpg' : img
      );
    }

    return {
      ...product,
      image: sanitizedImage,
      gallery: sanitizedGallery,
    };
  });
}

/**
 * Safely writes to localStorage with defensive fallback and quota protection.
 * Never throws unhandled QuotaExceededError or triggers console errors.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014;

    if (isQuotaError) {
      console.warn(`[SafeStorage] Almacenamiento local lleno al guardar "${key}". Aplicando limpieza de caché preventiva...`);
      
      // Try freeing obsolete keys
      try {
        localStorage.removeItem('aura_catalog_cart');
        localStorage.removeItem('aura_catalog_products');
        localStorage.removeItem('aura_catalog_orders');
      } catch {
        // ignore
      }

      // Try one more time after pruning
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // If still full, remove the oversized item to avoid persistent error states
        try {
          localStorage.removeItem(key);
        } catch {
          // ignore
        }
        console.warn(`[SafeStorage] Operando de forma segura en memoria y Firestore para "${key}".`);
        return false;
      }
    }

    console.warn(`[SafeStorage] No se pudo guardar en almacenamiento local: ${key}`, err);
    return false;
  }
}

/**
 * Save products to local storage safely
 */
export function saveProductsSafely(products: Product[]): void {
  try {
    const sanitized = sanitizeProductsForStorage(products);
    const json = JSON.stringify(sanitized);
    safeSetItem(PRODUCTS_KEY, json);
  } catch (err) {
    console.warn('[SafeStorage] Error al preparar productos para almacenamiento local:', err);
  }
}

/**
 * Load products from local storage safely
 */
export function loadProductsSafely(): Product[] | null {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // If corrupted or invalid, clear it
    try {
      localStorage.removeItem(PRODUCTS_KEY);
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Save orders to local storage safely
 */
export function saveOrdersSafely(orders: WhatsAppOrder[]): void {
  try {
    // Keep max 100 recent orders locally to prevent bloat
    const trimmed = orders.slice(0, 100);
    const json = JSON.stringify(trimmed);
    safeSetItem(ORDERS_KEY, json);
  } catch (err) {
    console.warn('[SafeStorage] Error al guardar pedidos en almacenamiento local:', err);
  }
}

/**
 * Load orders from local storage safely
 */
export function loadOrdersSafely(): WhatsAppOrder[] {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    try {
      localStorage.removeItem(ORDERS_KEY);
    } catch {
      // ignore
    }
  }
  return [];
}

/**
 * Save cart items to local storage safely
 */
export function saveCartSafely(cart: CartItem[]): void {
  try {
    const json = JSON.stringify(cart);
    safeSetItem(CART_KEY, json);
  } catch (err) {
    console.warn('[SafeStorage] Error al guardar carrito:', err);
  }
}

/**
 * Load cart items from local storage safely
 */
export function loadCartSafely(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY) || localStorage.getItem('aura_catalog_cart');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    try {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem('aura_catalog_cart');
    } catch {
      // ignore
    }
  }
  return [];
}
