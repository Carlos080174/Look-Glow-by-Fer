import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Award, ArrowUpRight, Package, AlertCircle } from 'lucide-react';
import { WhatsAppOrder, Product } from '../types';

interface AdminAnalyticsViewProps {
  orders: WhatsAppOrder[];
  products: Product[];
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ orders, products }) => {
  const [metric, setMetric] = useState<'units' | 'revenue'>('units');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered'>('all');

  // Compute sales per product
  const analyticsData = useMemo(() => {
    const relevantOrders = statusFilter === 'delivered' 
      ? orders.filter(o => o.status === 'entregado')
      : orders;

    const salesMap: Record<string, {
      id: string;
      name: string;
      shortName: string;
      brand: string;
      units: number;
      revenue: number;
      image?: string;
    }> = {};

    // Initialize with products that have had orders
    relevantOrders.forEach((order) => {
      order.items.forEach((item) => {
        const prod = products.find(p => p.id === item.productId);
        const name = item.productName || prod?.name || 'Producto';
        const shortName = name.length > 18 ? name.substring(0, 16) + '...' : name;

        if (!salesMap[item.productId]) {
          salesMap[item.productId] = {
            id: item.productId,
            name,
            shortName,
            brand: item.brand || prod?.brand || 'Look & Glow by Fer',
            units: 0,
            revenue: 0,
            image: item.image || prod?.image,
          };
        }

        const qty = item.quantity || 1;
        salesMap[item.productId].units += qty;
        salesMap[item.productId].revenue += (item.price || 0) * qty;
      });
    });

    const list = Object.values(salesMap);
    list.sort((a, b) => (metric === 'units' ? b.units - a.units : b.revenue - a.revenue));

    const totalUnitsSold = list.reduce((sum, item) => sum + item.units, 0);
    const totalRevenueGenerated = relevantOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = relevantOrders.length > 0 ? totalRevenueGenerated / relevantOrders.length : 0;
    const topProduct = list.length > 0 ? list[0] : null;

    return {
      ranking: list,
      chartData: list.slice(0, 8), // Top 8 in chart
      totalUnitsSold,
      totalRevenueGenerated,
      averageOrderValue,
      topProduct,
      totalOrdersCount: relevantOrders.length,
    };
  }, [orders, products, metric, statusFilter]);

  // Luxury color palette for bars
  const barColors = [
    '#D4AF37', // Gold primary
    '#8B5E3C', // Bronze luxury
    '#2E6B3B', // Deep emerald
    '#B45309', // Amber warm
    '#3B82F6', // Sapphire
    '#6366F1', // Indigo
    '#EC4899', // Rose
    '#64748B', // Slate
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F5EFE8] p-4 rounded-2xl border border-[#E8DCCF]">
        <div>
          <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#24211D] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8B5E3C]" />
            <span>Rendimiento y Productos Más Vendidos</span>
          </h3>
          <p className="text-xs text-[#7A7064]">
            Análisis de ventas acumuladas por pedidos de clientes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter toggle */}
          <div className="flex items-center bg-white p-0.5 border border-[#D8CABE] rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#24211D] text-white'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Todos los Pedidos
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'delivered'
                  ? 'bg-[#2E6B3B] text-white font-bold'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Solo Entregados
            </button>
          </div>

          {/* Metric selector */}
          <div className="flex items-center bg-white p-0.5 border border-[#D8CABE] rounded-xl text-xs">
            <button
              onClick={() => setMetric('units')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                metric === 'units'
                  ? 'bg-[#D4AF37] text-[#24211D] font-bold'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Unidades Vendidas
            </button>
            <button
              onClick={() => setMetric('revenue')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                metric === 'revenue'
                  ? 'bg-[#D4AF37] text-[#24211D] font-bold'
                  : 'text-[#6B5E50] hover:text-[#24211D]'
              }`}
            >
              Ingresos (Bs.)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5DACD] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7064] mb-1">
            <span>Unidades Vendidas</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF3E0] text-[#8B5E3C] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#24211D]">
            {analyticsData.totalUnitsSold} <span className="text-xs font-normal text-[#7A7064]">uds.</span>
          </div>
          <span className="text-[10px] text-[#2E6B3B] font-semibold mt-1 block">
            En {analyticsData.totalOrdersCount} pedidos
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DACD] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7064] mb-1">
            <span>Ingresos Totales</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F3EA] text-[#2E6B3B] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#24211D]">
            Bs. {analyticsData.totalRevenueGenerated.toFixed(2)}
          </div>
          <span className="text-[10px] text-[#7A7064] mt-1 block">
            Incluye subtotal y envíos
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DACD] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7064] mb-1">
            <span>Ticket Promedio</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5EFE8] text-[#8B5E3C] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#24211D]">
            Bs. {analyticsData.averageOrderValue.toFixed(2)}
          </div>
          <span className="text-[10px] text-[#7A7064] mt-1 block">
            Por pedido recibido
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5DACD] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7064] mb-1">
            <span>Producto Estrella</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFFBEB] text-[#D4AF37] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#24211D] truncate" title={analyticsData.topProduct?.name || 'N/D'}>
            {analyticsData.topProduct ? analyticsData.topProduct.name : 'Sin ventas aún'}
          </div>
          <span className="text-[10px] text-[#8B5E3C] font-semibold mt-1 block">
            {analyticsData.topProduct 
              ? `${analyticsData.topProduct.units} uds. vendidas (Bs. ${analyticsData.topProduct.revenue.toFixed(2)})`
              : 'Registra pedidos para calcular'}
          </span>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5DACD] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="font-serif-luxury text-base font-bold text-[#24211D]">
              Ranking: Productos Más Vendidos ({metric === 'units' ? 'Por Unidades' : 'Por Ingresos Bs.'})
            </h4>
            <p className="text-xs text-[#7A7064]">
              Visualización comparativa de los productos con mayor demanda en Look & Glow by Fer
            </p>
          </div>
          <span className="text-[11px] bg-[#FAF8F5] text-[#8B5E3C] px-3 py-1 rounded-full font-bold border border-[#E8DCCF] self-start sm:self-auto">
            Top {analyticsData.chartData.length} Artículos
          </span>
        </div>

        {analyticsData.chartData.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D8CABE]">
            <div className="w-12 h-12 rounded-full bg-white text-[#8C8275] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <ShoppingBag className="w-6 h-6 stroke-1 text-[#8B5E3C]" />
            </div>
            <h5 className="font-serif-luxury text-base font-bold text-[#24211D]">
              Aún no hay datos de ventas registrados
            </h5>
            <p className="text-xs text-[#7A7064] max-w-sm mx-auto mt-1">
              A medida que los clientes realicen pedidos por WhatsApp, se generará automáticamente el gráfico de barras y el ranking de productos más vendidos.
            </p>
          </div>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EAE1" />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fontSize: 11, fill: '#6B5E50', fontWeight: 500 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#7A7064' }}
                  tickFormatter={(val) => metric === 'units' ? `${val} u` : `Bs.${val}`}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#FAF8F5', opacity: 0.7 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#24211D] text-white p-3 rounded-xl shadow-xl text-xs border border-[#4A4237] max-w-xs">
                          <p className="font-bold text-[#D4AF37] mb-1">{data.name}</p>
                          <p className="text-[11px] text-[#C4B7A6] mb-2">{data.brand}</p>
                          <div className="space-y-1 border-t border-[#3D3731] pt-1.5 text-[11px]">
                            <div className="flex justify-between gap-4">
                              <span className="text-[#A89F91]">Unidades vendidas:</span>
                              <strong className="text-white">{data.units} uds.</strong>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-[#A89F91]">Ingresos generados:</span>
                              <strong className="text-[#A2E3B0]">Bs. {data.revenue.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey={metric === 'units' ? 'units' : 'revenue'} 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                >
                  {analyticsData.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Top Products Table */}
      {analyticsData.ranking.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5DACD] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif-luxury text-base font-bold text-[#24211D]">
              Tabla de Artículos y Demanda
            </h4>
            <span className="text-xs text-[#7A7064]">
              {analyticsData.ranking.length} productos con ventas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F0E6D8] text-[10px] uppercase tracking-wider text-[#8B5E3C]">
                  <th className="py-2.5 px-3"># Ranking</th>
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3 text-center">Unidades</th>
                  <th className="py-2.5 px-3 text-right">Facturación</th>
                  <th className="py-2.5 px-3 text-center">Stock Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE8]">
                {analyticsData.ranking.map((item, idx) => {
                  const prod = products.find(p => p.id === item.id);
                  const currentStock = prod ? (prod.stockCount ?? (prod.inStock ? 20 : 0)) : null;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#6B5E50]">
                        {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-8 h-8 rounded-lg object-cover bg-[#F2ECE4] border border-[#E8DCCF] flex-shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-bold text-[#24211D] block">{item.name}</span>
                            <span className="text-[10px] text-[#7A7064]">{item.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#24211D]">
                        {item.units} uds.
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#2E6B3B]">
                        Bs. {item.revenue.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {currentStock !== null ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            currentStock < 5 
                              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' 
                              : 'bg-[#E8F3EA] text-[#2E6B3B]'
                          }`}>
                            {currentStock} en inventario
                          </span>
                        ) : (
                          <span className="text-[#A89F91]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
