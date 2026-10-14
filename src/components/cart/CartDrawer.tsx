import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Tag, 
  Check, 
  Sparkles, 
  Gift 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onContinueShopping
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    settings, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon 
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  // Free delivery calculation
  const freeThreshold = settings.freeDeliveryThreshold || 350;
  const remainingForFreeDelivery = Math.max(0, freeThreshold - cartSubtotal);
  const deliveryProgressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const finalSubtotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponFeedback({
      text: res.message,
      isError: !res.success
    });
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-[#F8DDE6]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F8DDE6] flex items-center justify-between bg-[#FFF9FA]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#AD647D]" />
              <h3 className="text-base font-bold text-[#2D141E]">
                سلة التسوق ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-pink-100 text-[#AD647D] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery tracker */}
          <div className="bg-[#FFF0F4] px-5 py-3 border-b border-[#F8DDE6] text-xs">
            {remainingForFreeDelivery > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#AD647D] font-semibold">
                  <span>أضف {remainingForFreeDelivery} ر.س للحصول على توصيل مجاني! 🚚</span>
                  <span>{deliveryProgressPercent}%</span>
                </div>
                <div className="w-full bg-[#F8DDE6] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${deliveryProgressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Sparkles className="w-4 h-4 text-[#C9A46A]" />
                <span>تهانينا! طلبيتك مؤهلة للشحن المجاني الفاخر 🎉</span>
              </div>
            )}
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-gray-500">
                <div className="w-20 h-20 rounded-full bg-[#FFF0F4] flex items-center justify-center border border-[#F8DDE6]">
                  <ShoppingBag className="w-10 h-10 text-[#E7A0B4]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#4A2030]">سلتك فارغة حالياً</h4>
                  <p className="text-xs text-gray-400 mt-1">تصفح باقاتنا الفاخرة واختر ما يبهج أحبابك</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="bg-[#AD647D] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#8C465F] transition"
                >
                  تصفح الباقات الآن
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#FFFDFD] rounded-2xl border border-[#F8DDE6] flex gap-3 shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#F8DDE6] shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#2D141E] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Chosen size */}
                      {item.selectedSize && (
                        <div className="text-[10px] text-[#AD647D] mt-0.5 font-medium">
                          الحجم: {item.selectedSize.name}
                        </div>
                      )}

                      {/* Addons */}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[10px] text-[#C9A46A] mt-0.5">
                          إضافات: {item.selectedAddons.map(a => a.name).join('، ')}
                        </div>
                      )}

                      {/* Gift message preview */}
                      {item.giftCardMessage && (
                        <div className="text-[10px] text-gray-500 bg-[#FFF9FA] p-1.5 rounded-md mt-1 border border-pink-100 italic line-clamp-1 flex items-center gap-1">
                          <Gift className="w-2.5 h-2.5 text-[#AD647D] shrink-0" />
                          <span>"{item.giftCardMessage}"</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-pink-50">
                      <div className="font-bold text-xs text-[#AD647D]">
                        {item.totalPrice} ر.س
                      </div>

                      <div className="flex items-center gap-1 bg-white border border-[#F8DDE6] rounded-full p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 rounded-full bg-[#FFF0F4] text-[#AD647D] hover:bg-[#E7A0B4] hover:text-white flex items-center justify-center text-xs"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-[#FFF0F4] text-[#AD647D] hover:bg-[#E7A0B4] hover:text-white flex items-center justify-center text-xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#F8DDE6] bg-[#FFF9FA] space-y-3">
              
              {/* Coupon Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>كود مفعّل: <strong>{appliedCoupon.code}</strong> (خصم {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue} ر.س`})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 text-[11px] font-bold hover:underline"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم (جرب FATEN10 أو WELCOME)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 bg-white border border-[#F8DDE6] rounded-xl px-3 py-2 text-xs uppercase placeholder-gray-400 focus:outline-hidden focus:border-[#E7A0B4]"
                    />
                    <button
                      type="submit"
                      className="bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                    >
                      تطبيق
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <div className={`text-[11px] mt-1 font-semibold ${couponFeedback.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                    {couponFeedback.text}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5D2B3D] pt-1">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold">{cartSubtotal} ر.س</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>خصم الكوبون:</span>
                    <span className="font-bold">-{discountAmount} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>رسوم التوصيل:</span>
                  <span className="font-medium text-gray-500">
                    {remainingForFreeDelivery === 0 ? 'مجاناً 🎁' : 'تحسب في صفحة الدفع'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#2D141E] pt-2 border-t border-[#F8DDE6]">
                  <span>الإجمالي التقديري:</span>
                  <span className="text-base text-[#AD647D]">{finalSubtotal} ر.س</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#E7A0B4] via-[#AD647D] to-[#AD647D] text-white font-bold text-xs rounded-2xl shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>متابعة إتمام الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
