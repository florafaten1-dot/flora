import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Gift, 
  MapPin, 
  Phone, 
  Printer, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    const found = orders.find(o => 
      o.orderNumber.toLowerCase().includes(term) ||
      o.id.toLowerCase().includes(term) ||
      o.customerPhone.includes(term) ||
      (o.recipientPhone && o.recipientPhone.includes(term))
    );

    setSearchedOrder(found || null);
    setSearched(true);
  };

  // Helper to determine status progress step (1 to 5)
  const getStepStatus = (status: OrderStatus) => {
    switch (status) {
      case 'new':
      case 'pending_payment':
        return 1;
      case 'paid':
        return 1;
      case 'processing':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
      case 'refunded':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = searchedOrder ? getStepStatus(searchedOrder.status) : 1;

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 'طلب جديد قيد المراجعة';
      case 'pending_payment': return 'بانتظار تأكيد الدفع';
      case 'paid': return 'تم الدفع بنجاح';
      case 'processing': return 'قيد التجهيز والتنسيق اليدوي';
      case 'out_for_delivery': return 'خرج للتوصيل مع المندوب';
      case 'completed': return 'تم التسليم بنجاح';
      case 'cancelled': return 'ملغي';
      case 'refunded': return 'مسترجع';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Title */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF0F4] border border-[#F8DDE6] rounded-full text-xs font-bold text-[#AD647D]">
          <Compass className="w-4 h-4 text-[#C9A46A]" />
          <span>متابعة الشحنات الفورية</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          تتبع حالة طلبك في Flora Faten
        </h1>
        <p className="text-xs sm:text-sm text-[#5D2B3D]/80 max-w-md mx-auto">
          أدخل رقم طلبك (مثال: FF-202610-XXXX) أو رقم الجوال لمتابعة رحلة الباقة لحظة بلحظة.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#F8DDE6] rounded-3xl p-4 sm:p-6 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="رقم الطلب (مثال: FF-202610-8421) أو رقم الجوال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm text-[#2D141E] placeholder-gray-400 focus:outline-hidden focus:border-[#E7A0B4]"
            />
            <Search className="w-5 h-5 text-[#AD647D] absolute right-4 top-3.5" />
          </div>

          <button
            type="submit"
            className="py-3 px-8 bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] hover:brightness-105 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition"
          >
            بحث وتتبع
          </button>
        </form>

        {/* Quick hint for recent orders */}
        {orders.length > 0 && !searchedOrder && (
          <div className="mt-4 pt-3 border-t border-pink-50 text-[11px] text-gray-500 flex items-center gap-2 flex-wrap">
            <span>أحدث الطلبات في المتجر للاختبار السريع:</span>
            {orders.slice(0, 3).map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchTerm(o.orderNumber);
                  setSearchedOrder(o);
                  setSearched(true);
                }}
                className="bg-[#FFF0F4] text-[#AD647D] px-2.5 py-1 rounded-lg font-mono font-bold hover:bg-[#F8DDE6] transition"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results View */}
      {searched && (
        <div>
          {searchedOrder ? (
            <div className="bg-white border border-[#F8DDE6] rounded-3xl p-6 sm:p-8 shadow-md space-y-8 animate-fadeIn">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F8DDE6] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#2D141E] font-serif-lux">
                      طلب رقم: <span className="font-mono text-[#AD647D]">{searchedOrder.orderNumber}</span>
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 block mt-1">
                    تاريخ الإنشاء: {new Date(searchedOrder.createdAt).toLocaleDateString('ar-SA')} - {new Date(searchedOrder.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                    searchedOrder.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : searchedOrder.status === 'cancelled'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-[#FFF0F4] text-[#AD647D] border-[#E7A0B4]'
                  }`}>
                    {getStatusText(searchedOrder.status)}
                  </span>

                  <button
                    onClick={() => window.print()}
                    className="p-2 border border-[#F8DDE6] rounded-xl hover:bg-pink-50 text-[#AD647D] transition"
                    title="طباعة الفاتورة"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              {searchedOrder.status !== 'cancelled' && searchedOrder.status !== 'refunded' ? (
                <div className="py-2">
                  <h4 className="text-xs font-bold text-[#AD647D] mb-6">مراحل تنفيذ وتوصيل الهدية:</h4>
                  
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 right-[12%] left-[12%] h-1 bg-[#F8DDE6] -z-0">
                      <div
                        className="h-full bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] transition-all duration-700"
                        style={{
                          width: currentStep >= 4 ? '100%' : currentStep === 3 ? '66%' : currentStep === 2 ? '33%' : '0%'
                        }}
                      />
                    </div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                        currentStep >= 1 ? 'bg-[#AD647D] text-white ring-4 ring-pink-100' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold mt-2 text-[#2D141E]">تم الاستلام</span>
                      <span className="text-[10px] text-gray-400 hidden sm:inline">تأكيد الحجز والدفع</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                        currentStep >= 2 ? 'bg-[#AD647D] text-white ring-4 ring-pink-100' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold mt-2 text-[#2D141E]">قيد التنسيق</span>
                      <span className="text-[10px] text-gray-400 hidden sm:inline">تجهيز الزهور والكرت</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                        currentStep >= 3 ? 'bg-[#AD647D] text-white ring-4 ring-pink-100' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold mt-2 text-[#2D141E]">خرج للتوصيل</span>
                      <span className="text-[10px] text-gray-400 hidden sm:inline">مع مندوب فلورا فاتن</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                        currentStep >= 4 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold mt-2 text-[#2D141E]">تم التسليم</span>
                      <span className="text-[10px] text-gray-400 hidden sm:inline">وصلت الهدية بسلام 🌸</span>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>تم إلغاء هذا الطلب من قبل الإدارة أو العميل.</span>
                </div>
              )}

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F8DDE6]">
                
                {/* Items */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-[#AD647D]">المنتجات في هذه الطلبية:</h5>
                  <div className="divide-y divide-pink-50 border border-[#F8DDE6] rounded-2xl p-3 bg-[#FFFDFD]">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#F8DDE6]"
                        />
                        <div className="flex-1">
                          <h6 className="text-xs font-bold text-[#2D141E]">{item.name}</h6>
                          <div className="text-[10px] text-gray-500">
                            الكمية: {item.quantity} × {item.unitPrice} ر.س
                            {item.selectedSize && ` (${item.selectedSize.name})`}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#AD647D]">{item.itemTotal} ر.س</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Gift Info */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-[#AD647D]">تفاصيل الشحنة والإهداء:</h5>
                  <div className="border border-[#F8DDE6] rounded-2xl p-4 bg-[#FFF9FA] space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">المستلم:</span>
                      <span className="font-bold text-[#2D141E]">{searchedOrder.recipientName || searchedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">مدينة التوصيل:</span>
                      <span className="font-bold text-[#2D141E]">{searchedOrder.deliveryCity} ({searchedOrder.deliveryDistrict})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">موعد التسليم:</span>
                      <span className="font-bold text-[#AD647D]">{searchedOrder.deliveryDate} - {searchedOrder.deliveryTimeSlot}</span>
                    </div>
                    {searchedOrder.giftCardMessage && (
                      <div className="pt-2 border-t border-pink-100">
                        <span className="text-gray-500 block mb-1">نص كرت الإهداء:</span>
                        <div className="bg-white p-2.5 rounded-xl border border-dashed border-[#C9A46A] italic text-[11px] text-[#4A2030]">
                          "{searchedOrder.giftCardMessage}"
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-pink-100 font-bold text-[#AD647D] text-sm">
                      <span>إجمالي الفاتورة:</span>
                      <span>{searchedOrder.total} ر.س</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Need Help WhatsApp */}
              <div className="p-4 rounded-2xl bg-[#FFF0F4] border border-[#F8DDE6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-bold text-[#AD647D]">هل لديك أي استفسار حول هذه الطلبية؟</h5>
                  <p className="text-[11px] text-gray-500">فريق خدمة عملاء فلورا فاتن متواجد لخدمتك على مدار الساعة.</p>
                </div>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`أهلاً، أود الاستفسار عن طلبي رقم ${searchedOrder.orderNumber}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>تواصل عبر الواتساب</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-[#F8DDE6] rounded-3xl p-8 text-center text-gray-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-[#4A2030]">لم يتم العثور على طلب مطابق</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                تأكد من إدخال رقم الطلب الصحيح (مثال: FF-202610-XXXX) أو رقم الجوال المسجل به الطلب.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
