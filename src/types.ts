export type CategoryId = 'todos' | 'labiales' | 'rostro' | 'ojos' | 'fragancias' | 'sets';

export interface ProductVariant {
  id: string;
  name: string;
  colorHex?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  brand: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  fullDescription: string;
  presentation: string;
  benefits: string[];
  howToUse: string;
  badges: string[];
  inStock: boolean;
  stockCount?: number; // Cantidad en inventario
  variants?: ProductVariant[];
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand?: string;
  category?: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
  image?: string;
}

export type OrderStatus = 'pendiente' | 'entregado' | 'cancelado';

export interface WhatsAppOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  channel: 'WhatsApp';
  createdAt: string;
  deliveredAt?: string;
  stockDeducted?: boolean;
}
