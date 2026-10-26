import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, Truck, Check, Loader2 } from 'lucide-react';
import { CartItem, WhatsAppOrder, OrderItem } from '../types';
import { getWhatsAppUrl } from '../constants/contact';
import { createWhatsAppOrderInFirestore } from '../services/firestoreService';
import { loadOrdersSafely, saveOrdersSafely } from '../utils/safeStorage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCreated?: (order: WhatsAppOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 35.0;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = remainingForFreeShipping === 0 ? 0 : 3.5;
  const finalTotal = subtotal + shippingCost;

  const handleWhatsAppOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const orderNumber = `LG-${Date.now().toString().slice(-6)}`;
      const orderItems: OrderItem[] = cartItems.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        brand: ci.product.brand,
        category: ci.product.category,
        price: ci.product.price,
        quantity: ci.quantity,
        selectedVariant: ci.selectedVariant || '',
        image: ci.product.image || '',
      }));

      const newOrder: WhatsAppOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerName: customerName.trim() || 'Cliente WhatsApp',
        customerAddress: customerAddress.trim() || 'Por coordinar por chat',
        customerPhone: customerPhone.trim() || '',
        items: orderItems,
        itemCount: cartItems.reduce((acc, it) => acc + it.quantity, 0),
        subtotal,
        shippingCost,
        total: finalTotal,
        status: 'pendiente',
        channel: 'WhatsApp',
        createdAt: new Date().toISOString(),
        stockDeducted: false,
      };

      // 1. Register order in database and app state
      try {
        await createWhatsAppOrderInFirestore(newOrder);
      } catch (err) {
        console.warn('Could not sync order to cloud Firestore, saving locally:', err);
      }

      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }

      // Also persist locally with safe storage for resilience
      const localOrders = loadOrdersSafely();
      saveOrdersSafely([newOrder, ...localOrders]);

      // 2. Prepare WhatsApp structured text
      let itemsList = cartItems
        .map((item, index) => {
          const variantText = item.selectedVariant ? ` (${item.selectedVariant})` : '';
          return `${index + 1}. *${item.product.name}*${variantText} x${item.quantity} - Bs. ${(item.product.price * item.quantity).toFixed(2)}`;
        })
        .join('\n');

      const message = `¡Hola Look & Glow by Fer! Deseo realizar el siguiente pedido [Nº ${orderNumber}]:\n\n${itemsList}\n\n*Subtotal:* Bs. ${subtotal.toFixed(2)}\n*Envío:* ${shippingCost === 0 ? 'Gratis' : 'Bs. ' + shippingCost.toFixed(2)}\n*Total a Pagar:* Bs. ${finalTotal.toFixed(2)}\n\n*Cliente:* ${customerName || 'Por coordinar'}\n*Dirección de entrega:* ${customerAddress || 'Por coordinar'}\n\n¿Tienen disponibilidad para coordinar la entrega y medios de pago? ¡Muchas gracias!`;

      // Open WhatsApp chat
      window.open(getWhatsAppUrl(message), '_blank');

      setOrderConfirmed(true);

      // Auto close cart and reset after slight delay
      setTimeout(() => {
        onClearCart();
        setOrderConfirmed(false);
        setIsSubmitting(false);
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Error generating WhatsApp order:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-[#E0D5C7] flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DCCF] bg-[#F5EFE8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] flex-shrink-0 shadow-xs">
                <img
                  src="/fer-cosmetic-logo.jpg"
                  alt="Look & Glow by Fer"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="font-serif-luxury text-lg font-bold text-[#24211D] leading-tight">
                  Mi Pedido ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <span className="text-[10px] text-[#8B5E3C] font-semibold uppercase tracking-wider block">
                  Look & Glow by Fer
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5A5043] hover:text-[#24211D] rounded-full hover:bg-[#EAE0D3]"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-[#FAF8F5] px-5 py-3 border-b border-[#E8DCCF]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#6B5E50] flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#8B5E3C]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="font-bold text-[#4E7756]">¡Tienes Envío Gratis! 🎉</span>
                ) : (
                  <span>
                    Te faltan <strong className="text-[#24211D]">Bs. {remainingForFreeShipping.toFixed(2)}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="font-bold text-[#24211D]">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E8DCCF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5E3C] transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-[#F2ECE4] text-[#8C8275] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#24211D] mb-1">
                  Tu pedido está vacío
                </h3>
                <p className="text-xs text-[#7A7064] max-w-xs mx-auto mb-5">
                  Explora el catálogo y añade tus productos favoritos de belleza y maquillaje.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#24211D] text-white text-xs font-bold rounded-full hover:bg-[#3D3731] cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                  className="flex gap-3 p-3 bg-[#FAF8F5] border border-[#E8DCCF] rounded-2xl hover:border-[#D5C7B5] transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-[#F2ECE4] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8B5E3C] block leading-none mb-1">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-bold text-[#24211D] truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="text-[11px] text-[#7A7064] block">
                          Modelo: {item.selectedVariant}
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#24211D] mt-0.5 block">
                        Bs. ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2ECE4]">
                      {/* Counter */}
                      <div className="flex items-center bg-[#F2ECE4] rounded-full border border-[#D5C7B5] px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="text-[#5A5043] hover:text-[#24211D] p-0.5"
                          aria-label="Disminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#24211D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="text-[#5A5043] hover:text-[#24211D] p-0.5"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#A85858] hover:text-[#7A3333] p-1 text-xs cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#E8DCCF] bg-[#F5EFE8] space-y-4">
              
              {/* Optional Quick Customer Info */}
              <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E0D5C7]">
                <input
                  type="text"
                  placeholder="Tu Nombre (Opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-transparent border-b border-[#E0D5C7] text-xs text-[#24211D] focus:outline-none focus:border-[#24211D]"
                />
                <input
                  type="text"
                  placeholder="Ciudad o Dirección de entrega (Opcional)"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-1.5 bg-transparent text-xs text-[#24211D] focus:outline-none"
                />
              </div>

              {/* Subtotal & Shipping */}
              <div className="space-y-1.5 text-xs text-[#6B5E50]">
                <div className="flex justify-between">
                  <span>Subtotal productos</span>
                  <span className="font-bold text-[#24211D]">Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-bold text-[#24211D]">
                    {remainingForFreeShipping === 0 ? 'Gratis' : 'Bs. 3.50'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#24211D] pt-2 border-t border-[#E0D5C7]">
                  <span>Total Estimado</span>
                  <span>Bs. {(subtotal + (remainingForFreeShipping === 0 ? 0 : 3.5)).toFixed(2)}</span>
                </div>
              </div>

              {/* Order Confirmation message */}
              {orderConfirmed && (
                <div className="p-3 bg-[#E8F3EA] border border-[#A2E3B0] rounded-2xl text-center text-xs text-[#2E6B3B] font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>¡Pedido registrado con éxito! Te contactaremos pronto.</span>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  disabled={isSubmitting || orderConfirmed}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando y abriendo WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                      <span>Enviar Pedido por WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[10px] text-[#7A7064] space-y-1">
                <div>💬 Tu pedido se registrará y se enviará al WhatsApp de Look & Glow by Fer</div>
                <div>🔒 Pagos contra entrega, transferencias QR y entregas coordinadas</div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
