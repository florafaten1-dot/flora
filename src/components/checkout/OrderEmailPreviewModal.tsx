import React from 'react';
import { Mail, CheckCircle2, Flower2, Clock } from 'lucide-react';
import { Order, StoreSettings } from '../../types';

interface OrderEmailPreviewModalProps {
  order: Order;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderEmailPreviewModal: React.FC<OrderEmailPreviewModalProps> = ({
  order,
  settings,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#F8DDE6] overflow-hidden my-4 max-h-[90vh] flex flex-col justify-between">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#F8DDE6] bg-[#FFF9FA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#AD647D]" />
            <div>
              <h3 className="text-sm font-bold text-[#2D141E]">
                معاينة البريد الإلكتروني للطلب (Email Template)
              </h3>
              <p className="text-[11px] text-[#AD647D]">
                إشعار تلقائي يُرسل لبريد العميل والإدارة مع الشعار الديناميكي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: HTML Email Simulation */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F9F9FB] space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6 max-w-lg mx-auto text-right">
            
            {/* Email Header with Dynamic Store Logo */}
            <div className="text-center pb-6 border-b border-pink-100 space-y-3">
              <div className="flex justify-center">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.storeName || 'Flora Faten'}
                    className="h-16 w-16 object-cover rounded-full border-2 border-[#C9A46A] shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] border-2 border-[#C9A46A] flex items-center justify-center shadow-xs mx-auto">
                    <Flower2 className="w-8 h-8 text-[#AD647D]" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold font-serif-lux text-[#AD647D]">
                {settings.storeName || 'Flora Faten | فلورا فاتن'}
              </h2>
              <p className="text-xs text-gray-500">
                {settings.tagline || 'حيث تتفتح مشاعرك بأرقى باقات الورد والهدايا'}
              </p>
            </div>

            {/* Notification Badge */}
            <div className="bg-[#FFF0F4] border border-[#F8DDE6] p-4 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold text-[#C9A46A] uppercase tracking-wider block">
                تأكيد الطلب الفاخر
              </span>
              <h3 className="text-base font-black text-[#2D141E]">
                مرحباً {order.customerName}، تم استلام طلبك بنجاح! 🌸
              </h3>
              <p className="text-xs text-gray-600">
                رقم الطلب المرجعي: <strong className="font-mono text-[#AD647D]">{order.orderNumber}</strong>
              </p>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 border-b pb-1">تفاصيل الباقات والمنتجات:</h4>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-[10px] text-gray-400">الكمية: {item.quantity} × {item.unitPrice} ر.س</div>
                    </div>
                    <div className="font-bold text-[#AD647D]">{item.itemTotal} ر.س</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-3 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي:</span>
                <span>{order.subtotal} ر.س</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>رسوم التوصيل ({order.deliveryCity}):</span>
                <span>{order.deliveryFee === 0 ? 'مجاناً' : `${order.deliveryFee} ر.س`}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{order.discountAmount} ر.س</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-[#AD647D] pt-2 border-t border-gray-200">
                <span>الإجمالي النهائي المدفوع:</span>
                <span>{order.total} ر.س</span>
              </div>
            </div>

            {/* Delivery address & gift card */}
            <div className="text-xs space-y-1 border-t pt-3 text-gray-600">
              <div><strong>العنوان:</strong> {order.deliveryCity} - {order.deliveryDistrict}</div>
              <div><strong>موعد التسليم المختار:</strong> {order.deliveryDate} ({order.deliveryTimeSlot}) - خلال 2 إلى 5 أيام</div>
              <div><strong>طريقة السداد:</strong> الدفع عند الاستلام فقط (نقدًا أو شبكة للمندوب)</div>
              {order.giftCardMessage && (
                <div className="bg-[#FFF9FA] p-2.5 rounded-lg border border-dashed border-[#C9A46A] mt-2">
                  <strong className="text-[#AD647D] block">نص كرت الإهداء:</strong>
                  <span className="italic">"{order.giftCardMessage}"</span>
                </div>
              )}
            </div>

            {/* Email Footer with Dynamic Branding */}
            <div className="text-center pt-4 border-t border-pink-100 text-[11px] text-gray-400 space-y-1">
              <p>تم إرسال هذا البريد تلقائياً من نظام متجر {settings.storeName}.</p>
              <p>هاتف خدمة العملاء: {settings.phone} • {settings.email}</p>
              <p className="font-serif-lux font-bold text-[#AD647D] pt-1">Flora Faten • مكة المكرمة - حي الحمراء</p>
            </div>

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-[#F8DDE6] bg-white flex justify-end gap-2">
          <button
            onClick={() => window.print()}
            className="py-2 px-4 border border-[#F8DDE6] text-[#AD647D] rounded-xl text-xs font-bold"
          >
            طباعة الإشعار
          </button>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#AD647D] text-white rounded-xl text-xs font-bold"
          >
            إغلاق المعاينة
          </button>
        </div>

      </div>
    </div>
  );
};
