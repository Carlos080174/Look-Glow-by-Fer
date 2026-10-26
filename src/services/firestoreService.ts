import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, WhatsAppOrder } from '../types';
import { PRODUCTS } from '../data/products';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

/**
 * Quick connection check
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    console.warn('Firestore connection check note:', error);
    return false;
  }
}

/**
 * Seed or sync initial products to Firestore if empty or missing
 */
export async function seedInitialProductsIfNeeded(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      const batch = writeBatch(db);
      for (const prod of PRODUCTS) {
        const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        const prodData: Product = {
          ...prod,
          stockCount: prod.stockCount ?? 20, // Cantidad en inventario por defecto
          inStock: prod.inStock ?? true,
          updatedAt: new Date().toISOString()
        };
        batch.set(docRef, prodData);
      }
      await batch.commit();
      console.log('Successfully seeded products in Firestore.');
    }
  } catch (error) {
    console.warn('Firestore seeding check notice:', error);
  }
}

/**
 * Real-time listener for Products in Firestore
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is still initializing or empty, fallback to local defaults
        onUpdate(PRODUCTS);
        return;
      }
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Product);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore products listener error, falling back:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Helper function to deep clean any object so that undefined fields
 * (which cause Firestore to throw errors) are removed safely.
 */
function cleanForFirestore<T>(obj: T): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
}

/**
 * Save or update a product in Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  const data = {
    ...product,
    stockCount: typeof product.stockCount === 'number' ? product.stockCount : (product.inStock ? 10 : 0),
    inStock: product.inStock,
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, cleanForFirestore(data), { merge: true });
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Record a new WhatsApp Order in Firestore
 */
export async function createWhatsAppOrderInFirestore(order: WhatsAppOrder): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  const cleanOrder = cleanForFirestore(order);
  await setDoc(docRef, cleanOrder, { merge: true });
}

/**
 * Real-time listener for Orders in Firestore
 */
export function subscribeToOrders(
  onUpdate: (orders: WhatsAppOrder[]) => void,
  onError?: (err: Error) => void
) {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const list: WhatsAppOrder[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as WhatsAppOrder);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore orders subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Mark order as delivered and automatically deduct items from stock.
 * Uses batch.set(..., { merge: true }) so it succeeds even if the order or product
 * document was previously only stored locally or created during offline/migration states.
 */
export async function markOrderAsDeliveredInFirestore(
  order: WhatsAppOrder,
  currentProducts: Product[]
): Promise<{ success: boolean; updatedProducts: Product[] }> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
    let updatedProducts = [...currentProducts];
    const batch = writeBatch(db);

    // Only deduct stock if not already deducted
    if (!order.stockDeducted) {
      for (const item of order.items) {
        const prodIndex = updatedProducts.findIndex((p) => p.id === item.productId);
        if (prodIndex !== -1) {
          const prod = updatedProducts[prodIndex];
          const currentCount = typeof prod.stockCount === 'number' ? prod.stockCount : 10;
          const newCount = Math.max(0, currentCount - item.quantity);
          const newInStock = newCount > 0;
          
          const updatedProd: Product = {
            ...prod,
            stockCount: newCount,
            inStock: newInStock,
            updatedAt: new Date().toISOString()
          };
          
          updatedProducts[prodIndex] = updatedProd;
          
          const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
          batch.set(prodRef, cleanForFirestore({
            stockCount: newCount,
            inStock: newInStock,
            updatedAt: new Date().toISOString()
          }), { merge: true });
        }
      }
    }

    // Always use set with { merge: true } for order to guarantee it never fails with "No document to update"
    const updatedOrderData = cleanForFirestore({
      ...order,
      status: 'entregado',
      deliveredAt: new Date().toISOString(),
      stockDeducted: true
    });

    batch.set(orderDocRef, updatedOrderData, { merge: true });
    
    await batch.commit();

    return { success: true, updatedProducts };
  } catch (error) {
    console.error('Error marking order delivered:', error);
    // Fallback: try direct setDoc on the order if batch failed
    try {
      const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(orderDocRef, cleanForFirestore({
        ...order,
        status: 'entregado',
        deliveredAt: new Date().toISOString(),
        stockDeducted: true
      }), { merge: true });
      return { success: true, updatedProducts: currentProducts };
    } catch (fallbackError) {
      console.error('Fallback setDoc error:', fallbackError);
      throw error;
    }
  }
}

/**
 * Delete an order from Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await deleteDoc(docRef);
}
