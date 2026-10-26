import React, { useState } from 'react';
import { 
  PackageCheck, CheckCircle2, Clock, MapPin, Phone, User, 
  Calendar, ShoppingBag, AlertCircle, Trash2, ArrowUpDown, Search, RefreshCw,
  Download, FileSpreadsheet
} from 'lucide-react';
import { WhatsAppOrder, Product } from '../types';

interface AdminOrdersManagerProps {
  orders: WhatsAppOrder[];
  products: Product[];
  onMarkAsDelivered: (order: WhatsAppOrder) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  isLoading?: boolean;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  products,
  onMarkAsDelivered,
  onDeleteOrder,
  isLoading = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'entregado'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [confirmDeliveredOrder, setConfirmDeliveredOrder] = useState<WhatsAppOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<WhatsAppOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerAddress.toLowerCase().includes(q) ||
      order.items.some((it) => it.productName.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  const pendingCount = orders.filter((o) => o.status === 'pendiente').length;
  const deliveredCount = orders.filter((o) => o.status === 'entregado').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'entregado')
    .reduce((sum, o) => sum + o.total, 0);

  const handleConfirmDelivery = async () => {
    if (!confirmDeliveredOrder) return;
    setProcessingOrderId(confirmDeliveredOrder.id);
    try {
      await onMarkAsDelivered(confirmDeliveredOrder);
      setConfirmDeliveredOrder(null);
    } catch (err) {
      console.warn('Mark delivered notice:', err);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await onDeleteOrder(orderToDelete.id);
      setOrderToDelete(null);
    } catch (err) {
      console.warn('Delete order notice:', err);
    }
  };

  const handleExportCSV = () => {
    const listToExport = filteredOrders.length > 0 ? filteredOrders : orders;
    if (listToExport.length === 0) return;

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Nº Pedido',
      'Fecha Creación',
      'Hora',
      'Cliente',
      'Teléfono',
      'Dirección',
      'Estado',
      'Total Items',
      'Subtotal (Bs)',
      'Envío (Bs)',
      'Total (Bs)',
      'Stock Descontado',
      'Fecha Entrega',
      'Canal',
      'Detalle de Productos'
    ];

    const rows = listToExport.map((o) => {
      const dateObj = new Date(o.createdAt);
      const dateFormatted = isNaN(dateObj.getTime())
        ? o.createdAt
        : dateObj.toLocaleDateString('es-BO', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const timeFormatted = isNaN(dateObj.getTime())
        ? ''
        : dateObj.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });

      const itemsDetail = o.items
        .map((it) => `${it.quantity}x ${it.productName}${it.selectedVariant ? ' [' + it.selectedVariant + ']' : ''} (Bs.${it.price.toFixed(2)})`)
        .join(' | ');

      const deliveryDate = o.deliveredAt
        ? new Date(o.deliveredAt).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' })
        : 'Pendiente';

      return [
        escapeCSV(o.orderNumber),
        escapeCSV(dateFormatted),
        escapeCSV(timeFormatted),
        escapeCSV(o.customerName || 'Cliente WhatsApp'),
        escapeCSV(o.customerPhone || 'N/D'),
        escapeCSV(o.customerAddress || 'Por coordinar'),
        escapeCSV(o.status === 'entregado' ? 'Entregado' : 'Pendiente'),
        escapeCSV(o.itemCount),
        escapeCSV(o.subtotal.toFixed(2)),
        escapeCSV(o.shippingCost.toFixed(2)),
        escapeCSV(o.total.toFixed(2)),
        escapeCSV(o.stockDeducted ? 'Sí' : 'No'),
        escapeCSV(deliveryDate),
        escapeCSV(o.channel || 'WhatsApp'),
        escapeCSV(itemsDetail),
      ].join(';');
    });

    // UTF-8 BOM so Excel opens accents without encoding glitches
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Look_and_Glow_by_Fer_Pedidos_${filterStatus !== 'all' ? filterStatus + '_' : ''}${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      
      {/* Sub-header & Statistics */}
      <div className="p-4 bg-[#F5EFE8] border-b border-[#E8DCCF] flex flex-col md:flex-row items-center justify-between gap-3 flex-shrink-0">
        
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7064]" />
            <input
              type="text"
              placeholder="Buscar por Nº de pedido o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D8CABE] rounded-xl text-xs text-[#24211D] focus:outline-none focus:border-[#24211D]"
            />
          </div>

          <div className="flex items-center gap-1 bg-white p-0.5 border border-[#D8CABE] rounded-xl text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-[#24211D] text-white'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pendiente')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'pendiente'
                  ? 'bg-[#D4AF37] text-[#24211D] font-bold'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('entregado')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === 'entregado'
                  ? 'bg-[#2E6B3B] text-white font-bold'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Entregados ({deliveredCount})
            </button>
          </div>
        </div>

        {/* Action buttons and mini stats */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#6B5E50] w-full md:w-auto justify-between md:justify-end">
          {/* CSV Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              orders.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                : 'bg-[#2E6B3B] hover:bg-[#23532D] text-white border border-[#23532D]'
            }`}
            title="Descargar pedidos en formato CSV compatible con Excel para contabilidad"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV</span>
            {filteredOrders.length > 0 && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-md font-mono">
                {filteredOrders.length}
              </span>
            )}
          </button>

          <div className="bg-white px-3 py-1.5 rounded-xl border border-[#D8CABE] flex items-center gap-2">
            <span className="text-[11px] text-[#7A7064]">Ventas Entregadas:</span>
            <strong className="text-[#2E6B3B] font-bold">Bs. {totalRevenue.toFixed(2)}</strong>
          </div>
        </div>

      </div>

      {/* Orders List Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5DACD] p-8">
            <div className="w-14 h-14 rounded-full bg-[#F2ECE4] text-[#8C8275] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7 stroke-1" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#24211D]">
              No hay pedidos registrados
            </h4>
            <p className="text-xs text-[#7A7064] mt-1 max-w-sm mx-auto">
              {filterStatus === 'pendiente'
                ? 'No tienes pedidos pendientes de entrega en este momento.'
                : 'Cuando un cliente presione "Enviar Pedido por WhatsApp" en el carrito, se registrará aquí automáticamente.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === 'entregado';
              const isProcessing = processingOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border transition-all p-4 shadow-xs flex flex-col justify-between ${
                    isDelivered
                      ? 'border-[#C8E6C9] bg-[#FAFDF9]'
                      : 'border-[#E0D5C7] hover:border-[#D4AF37]'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 border-b border-[#F2ECE4] pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#24211D] bg-[#F5EFE8] px-2 py-0.5 rounded-md">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] text-[#25D366] font-bold bg-[#E8F8EE] px-2 py-0.5 rounded-full flex items-center gap-1">
                            WhatsApp
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#7A7064] mt-1">
                          <Calendar className="w-3 h-3 text-[#8B5E3C]" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString('es-BO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div>
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E8F3EA] text-[#2E6B3B] text-[11px] font-bold rounded-full border border-[#A2E3B0]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Entregado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold rounded-full border border-[#FDE68A]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendiente</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE3D7] mb-3">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-[#8B5E3C] flex-shrink-0" />
                        <span className="text-[#24211D] font-medium truncate">
                          {order.customerName || 'Cliente WhatsApp'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#8B5E3C] flex-shrink-0" />
                        <span className="text-[#6B5E50] truncate" title={order.customerAddress}>
                          {order.customerAddress || 'Por coordinar'}
                        </span>
                      </div>
                    </div>

                    {/* Items Purchased List */}
                    <div className="space-y-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C] block">
                        Productos Solicitados ({order.itemCount} uds.)
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {order.items.map((item, idx) => {
                          const currentProd = products.find((p) => p.id === item.productId);
                          const remainingStock = currentProd ? (currentProd.stockCount ?? (currentProd.inStock ? 10 : 0)) : null;

                          return (
                            <div
                              key={`${item.productId}-${idx}`}
                              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-[#F0E6D8]"
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-7 h-7 rounded-md object-cover bg-[#F2ECE4] flex-shrink-0"
                                  />
                                )}
                                <div className="min-w-0">
                                  <span className="font-semibold text-[#24211D] block truncate">
                                    {item.productName}
                                  </span>
                                  {item.selectedVariant && (
                                    <span className="text-[10px] text-[#7A7064] block">
                                      Tono/Modelo: {item.selectedVariant}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-bold text-[#24211D]">
                                  {item.quantity}x Bs. {item.price.toFixed(2)}
                                </span>
                                {remainingStock !== null && (
                                  <span className="text-[9px] text-[#7A7064] block">
                                    Stock actual: {remainingStock}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between gap-3 mt-2">
                    <div>
                      <span className="text-[10px] text-[#7A7064] block">Monto Total</span>
                      <span className="font-serif-luxury text-base font-bold text-[#24211D]">
                        Bs. {order.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderToDelete(order)}
                        className="p-2 text-[#9B1C1C] hover:bg-[#FDF2F2] rounded-xl transition-colors cursor-pointer"
                        title="Eliminar registro de pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {isDelivered ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F3EA] text-[#2E6B3B] text-xs font-bold rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Inventario descontado</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeliveredOrder(order)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-[#2E6B3B] hover:bg-[#23532D] text-white rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <PackageCheck className="w-4 h-4 text-[#A2E3B0]" />
                          <span>Marcar como Entregado</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Marking as Delivered and Deducting Stock */}
      {confirmDeliveredOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 shadow-2xl border border-[#D5C4B0]">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F3EA] text-[#2E6B3B] flex items-center justify-center mb-4 mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>

            <h3 className="font-serif-luxury text-xl font-bold text-center text-[#24211D] mb-2">
              ¿Marcar Pedido como Entregado?
            </h3>
            
            <p className="text-xs text-[#6B5E50] text-center leading-relaxed mb-4">
              Al confirmar la entrega del pedido <strong className="text-[#24211D] font-mono">{confirmDeliveredOrder.orderNumber}</strong>, el sistema <strong>descontará automáticamente</strong> las unidades correspondientes del stock de cada producto en la base de datos para mantener tu inventario al día.
            </p>

            <div className="bg-white p-3 rounded-2xl border border-[#E0D5C7] space-y-1.5 mb-5 text-xs">
              <div className="font-bold text-[#24211D] text-xs border-b border-[#F0E6D8] pb-1">
                Se descontará del inventario:
              </div>
              {confirmDeliveredOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-[#5A5043]">
                  <span>• {it.productName} ({it.selectedVariant || 'Estándar'})</span>
                  <strong className="text-[#9B1C1C]">-{it.quantity} uds.</strong>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeliveredOrder(null)}
                disabled={processingOrderId !== null}
                className="px-4 py-2 text-xs font-bold text-[#6B5E50] hover:text-[#24211D] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelivery}
                disabled={processingOrderId !== null}
                className="px-5 py-2.5 bg-[#2E6B3B] hover:bg-[#23532D] text-white rounded-full text-xs font-bold tracking-wider transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#A2E3B0]" />
                <span>Confirmar y Descontar Stock</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Order */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#FAF8F5] rounded-3xl p-6 shadow-2xl border border-[#D5C4B0]">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] text-[#9B1C1C] flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif-luxury text-lg font-bold text-center text-[#24211D] mb-2">
              ¿Eliminar Registro de Pedido?
            </h3>
            
            <p className="text-xs text-[#6B5E50] text-center mb-5">
              Se eliminará el pedido <strong className="font-mono">{orderToDelete.orderNumber}</strong> de la lista. Esta acción no se puede deshacer.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-[#6B5E50] hover:text-[#24211D] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-[#9B1C1C] hover:bg-[#7A1616] text-white rounded-full text-xs font-bold tracking-wider transition-colors shadow-md cursor-pointer"
              >
                Eliminar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
