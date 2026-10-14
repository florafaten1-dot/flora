import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  CreditCard, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Printer, 
  Phone,
  Mail,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, Order } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { OrderEmailPreviewModal } from './OrderEmailPreviewModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { 
    cart, 
    cartSubtotal, 
    settings, 
    appliedCoupon, 
    currentUser, 
    createOrder 
  } = useStore();

  if (!isOpen) return null;

  // Checkout Form State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer info
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('05');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');

  // Delivery & Gift
  const [isGift, setIsGift] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [surpriseRecipient, setSurpriseRecipient] = useState(false);

  // Address in Makkah
  const makkahFallbackCities = [
    { name: 'مكة المكرمة - حي الحمراء (المنطقة الرئيسية)', fee: 15, active: true },
    { name: 'مكة المكرمة - حي الحمراء وأم الجود', fee: 15, active: true },
    { name: 'مكة المكرمة - الرصيفة والزهراء', fee: 20, active: true },
    { name: 'مكة المكرمة - العوالي والنسيم', fee: 20, active: true },
    { name: 'مكة المكرمة - العزيزية والجامعة', fee: 20, active: true },
    { name: 'مكة المكرمة - الشوقية والكعكية', fee: 20, active: true },
    { name: 'مكة المكرمة - بطحاء قريش والهجرة', fee: 20, active: true },
    { name: 'مكة المكرمة - الشرائع والخضراء', fee: 25, active: true },
    { name: 'مكة المكرمة - النوارية والعمرة', fee: 25, active: true },
    { name: 'مكة المكرمة - الزاهر والعتيبية', fee: 20, active: true },
    { name: 'مكة المكرمة - التنعيم والشهداء', fee: 25, active: true },
    { name: 'مكة المكرمة - المنطقة المركزية والحرم', fee: 25, active: true }
  ];

  const activeCities = (settings.cities && settings.cities.length > 0)
    ? settings.cities.filter(c => c.active && (c.name.includes('مكة') || settings.cities.length <= 12))
    : makkahFallbackCities;

  const defaultCityChoice = activeCities.find(c => c.name.includes('الحمراء'))?.name || activeCities[0]?.name || 'مكة المكرمة - حي الحمراء (المنطقة الرئيسية)';
  const [deliveryCity, setDeliveryCity] = useState(defaultCityChoice);
  const [deliveryDistrict, setDeliveryDistrict] = useState('حي الحمراء');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Date & Time (Delivery & Receipt within 2 to 5 days)
  const getDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const minDeliveryDate = getDateOffset(2); // 2 days from now
  const maxDeliveryDate = getDateOffset(5); // 5 days from now

  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('مسائي (4:00 م - 8:00 م)');

  // Gift Card
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [giftSenderName, setGiftSenderName] = useState('');

  // Payment: Cash on Delivery ONLY
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Calculations
  const selectedCityObj = activeCities.find(c => c.name === deliveryCity);
  const rawDeliveryFee = selectedCityObj?.fee ?? settings.deliveryFeeDefault ?? 25;
  const isFreeDelivery = cartSubtotal >= (settings.freeDeliveryThreshold || 350);
  const deliveryFee = isFreeDelivery ? 0 : rawDeliveryFee;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const tax = Math.round((cartSubtotal - discountAmount) * 0.15 * 100) / 100; // 15% VAT included in calculation or displayed
  const total = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (step === 1) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setErrorMessage('يرجى إدخال اسمك ورقم الجوال للمتابعة');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!deliveryDistrict.trim() || !deliveryAddress.trim()) {
        setErrorMessage('يرجى إدخال الحي والعنوان التفصيلي للتوصيل');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitOrder = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      // Map cart items to order items
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.image,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedAddons: item.selectedAddons,
        itemTotal: item.totalPrice
      }));

      const newOrder = await createOrder({
        userId: currentUser?.uid,
        customerName,
        customerPhone,
        customerEmail,
        isGift,
        recipientName: isGift ? recipientName : customerName,
        recipientPhone: isGift ? recipientPhone : customerPhone,
        surpriseRecipient,
        deliveryCity,
        deliveryDistrict,
        deliveryAddress,
        deliveryDate,
        deliveryTimeSlot,
        giftCardMessage: giftCardMessage.trim() || undefined,
        giftSenderName: giftSenderName.trim() || undefined,
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee,
        discountAmount,
        couponCode: appliedCoupon?.code,
        tax,
        total,
        status: paymentMethod === 'cod' ? 'new' : 'paid',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        notes: surpriseRecipient ? 'ملاحظة للإدارة والمندوب: مفاجأة - لا تتصل بالمرسل إلا للضرورة' : undefined
      });

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (error) {
      console.error('Order submission failed:', error);
      setErrorMessage('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F8DDE6] overflow-hidden my-4 max-h-[92vh] flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#F8DDE6] bg-[#FFF9FA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <div>
              <h3 className="text-base font-bold text-[#2D141E]">
                {completedOrder ? 'تم تأكيد طلبك بنجاح!' : 'إتمام الطلب والتوصيل الفاخر'}
              </h3>
              <p className="text-[11px] text-[#AD647D]">Flora Faten | فلورا فاتن</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-pink-100 text-[#AD647D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (if not completed) */}
        {!completedOrder && (
          <div className="px-6 py-3 bg-[#FFFDFD] border-b border-[#F8DDE6] flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-[#AD647D]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#AD647D] text-white' : 'bg-gray-200'}`}>1</span>
              <span>بياناتك</span>
            </div>
            <div className="w-8 h-0.5 bg-[#F8DDE6]" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-[#AD647D]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#AD647D] text-white' : 'bg-gray-200'}`}>2</span>
              <span>التوصيل والإهداء</span>
            </div>
            <div className="w-8 h-0.5 bg-[#F8DDE6]" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-[#AD647D]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#AD647D] text-white' : 'bg-gray-200'}`}>3</span>
              <span>الدفع عند الاستلام</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#C9A46A] tracking-wider uppercase">شكراً لاختيارك فلورا فاتن</span>
                <h3 className="text-2xl font-black text-[#2D141E] font-serif-lux mt-1">
                  تم استلام طلبك وبدأ فريقنا بالتجهيز! 💐
                </h3>
                <div className="inline-block bg-[#FFF0F4] border border-[#F8DDE6] px-4 py-1.5 rounded-full mt-3 text-xs font-bold text-[#AD647D]">
                  رقم الطلب: <span className="font-mono text-sm">{completedOrder.orderNumber}</span>
                </div>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl p-4 text-xs text-right space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between border-b border-pink-100 pb-2">
                  <span className="text-gray-500">اسم العميل:</span>
                  <span className="font-bold text-[#2D141E]">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-pink-100 pb-2">
                  <span className="text-gray-500">مدينة التوصيل:</span>
                  <span className="font-bold text-[#2D141E]">{completedOrder.deliveryCity} - {completedOrder.deliveryDistrict}</span>
                </div>
                <div className="flex justify-between border-b border-pink-100 pb-2">
                  <span className="text-gray-500">موعد التسليم:</span>
                  <span className="font-bold text-[#AD647D]">{completedOrder.deliveryDate} ({completedOrder.deliveryTimeSlot})</span>
                </div>
                <div className="flex justify-between border-b border-pink-100 pb-2">
                  <span className="text-gray-500">طريقة الدفع:</span>
                  <span className="font-bold text-emerald-700">
                    {completedOrder.paymentMethod === 'mada' ? 'مدى Mada (مكتمل)' : 
                     completedOrder.paymentMethod === 'apple_pay' ? 'Apple Pay (مكتمل)' : 
                     completedOrder.paymentMethod === 'visa' ? 'بطاقة بنكية (مكتمل)' : 'الدفع عند الاستلام'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-black text-[#AD647D]">
                  <span>المبلغ الإجمالي:</span>
                  <span>{completedOrder.total} ر.س</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3 max-w-md mx-auto">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-white border border-[#F8DDE6] text-[#AD647D] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FFF0F4] transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة إيصال الفاتورة</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً فلورا فاتن، أود الاستفسار عن طلبي رقم: ${completedOrder.orderNumber}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>متابعة الطلب عبر الواتساب</span>
                </a>
              </div>

              <div>
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-[#AD647D] underline"
                >
                  العودة للمتجر ومتابعة التسوق
                </button>
              </div>

            </div>
          ) : (
            /* Checkout Steps */
            <div>
              {/* In-UI Error Banner */}
              {errorMessage && (
                <div className="mb-4 bg-[#FFF0F3] border border-[#F8DDE6] text-[#A63A50] px-4 py-3 rounded-2xl text-xs flex items-center justify-between gap-2 animate-fadeIn shadow-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#A63A50] shrink-0" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-[#A63A50]/70 hover:text-[#A63A50] p-1 cursor-pointer transition"
                    title="إغلاق التنبيه"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 1: Customer Details */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <div className="bg-[#FFF0F4] p-3 rounded-xl border border-[#F8DDE6] text-xs text-[#AD647D] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#C9A46A]" />
                    <span>بياناتك محمية وتستخدم فقط للتواصل معك بشأن تحديثات الشحنة.</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#4A2030] mb-1">
                        الاسم الكريم <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: فاتن المحمد"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A2030] mb-1">
                        رقم الجوال السعودي <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="05XXXXXXXX"
                        dir="ltr"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-right focus:border-[#E7A0B4] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A2030] mb-1">
                        البريد الإلكتروني (اختياري لاستلام الفاتورة الإلكترونية)
                      </label>
                      <input
                        type="email"
                        placeholder="faten@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto py-2.5 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <span>التالي: تفاصيل التوصيل والإهداء</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Delivery & Gift Customization */}
              {step === 2 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  {/* Is Gift Toggle */}
                  <div className="p-3 bg-[#FFF9FA] rounded-2xl border border-[#F8DDE6] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#AD647D]">
                      <Gift className="w-4 h-4 text-[#C9A46A]" />
                      <span>هل هذا الطلب إهداء لشخص آخر؟</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD647D]"></div>
                    </label>
                  </div>

                  {/* Recipient Details if Gift */}
                  {isGift && (
                    <div className="p-3 bg-[#FFF0F4]/60 rounded-2xl border border-pink-200 space-y-3">
                      <div className="text-xs font-bold text-[#AD647D]">بيانات المستلم:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="اسم المستلم"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full bg-white border border-[#F8DDE6] rounded-xl p-2 text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="رقم جوال المستلم (للتنسيق معه)"
                            dir="ltr"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            className="w-full bg-white border border-[#F8DDE6] rounded-xl p-2 text-xs text-right"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs text-[#5D2B3D] cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={surpriseRecipient}
                          onChange={(e) => setSurpriseRecipient(e.target.checked)}
                          className="accent-[#AD647D] rounded-xs"
                        />
                        <span>مفاجأة: لا تخبر المستلم بهوية الراسل أو محتوى الهدية حتى لحظة التسليم 🤫</span>
                      </label>
                    </div>
                  )}

                    {/* Address Selection */}
                    <div className="space-y-3">
                      <div className="p-2.5 bg-[#FFF0F4] border border-[#F8DDE6] rounded-xl text-[11px] text-[#AD647D] font-bold flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span>🕋</span>
                          <span>نقطة التجهيز الرئيسية: <strong className="text-[#8C465F]">مكة المكرمة - حي الحمراء</strong></span>
                        </div>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#F8DDE6] text-[#2D141E]">
                          توصيل لجميع أحياء مكة
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#4A2030] mb-1">المنطقة في مكة المكرمة</label>
                          <select
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4]"
                          >
                            {activeCities.map(city => (
                              <option key={city.name} value={city.name}>
                                {city.name} ({city.fee} ر.س)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4A2030] mb-1">
                            الحي بمكة المكرمة <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: حي الحمراء، أم الجود، الرصيفة، العوالي، الشوقية..."
                            value={deliveryDistrict}
                            onChange={(e) => setDeliveryDistrict(e.target.value)}
                            className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4]"
                          />
                        </div>
                      </div>

                      {/* Quick District Badges */}
                      <div className="space-y-1.5 pt-0.5">
                        <span className="text-[10px] text-gray-500 font-medium">اختيار سريع للحي:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'حي الحمراء', zone: 'مكة المكرمة - حي الحمراء (المنطقة الرئيسية)', badge: '🌸 رئيسي' },
                            { name: 'أم الجود', zone: 'مكة المكرمة - حي الحمراء وأم الجود' },
                            { name: 'الرصيفة', zone: 'مكة المكرمة - الرصيفة والزهراء' },
                            { name: 'الزهراء', zone: 'مكة المكرمة - الرصيفة والزهراء' },
                            { name: 'العوالي', zone: 'مكة المكرمة - العوالي والنسيم' },
                            { name: 'الشوقية', zone: 'مكة المكرمة - الشوقية والكعكية' },
                            { name: 'العزيزية', zone: 'مكة المكرمة - العزيزية والجامعة' },
                            { name: 'بطحاء قريش', zone: 'مكة المكرمة - بطحاء قريش والهجرة' },
                            { name: 'الشرائع', zone: 'مكة المكرمة - الشرائع والخضراء' }
                          ].map((item) => {
                            const isSelected = deliveryDistrict.includes(item.name);
                            return (
                              <button
                                key={item.name}
                                type="button"
                                onClick={() => {
                                  setDeliveryDistrict(item.name);
                                  const matchingCity = activeCities.find(c => c.name.includes(item.name) || (item.zone && c.name === item.zone));
                                  if (matchingCity) {
                                    setDeliveryCity(matchingCity.name);
                                  }
                                }}
                                className={`text-[10px] px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-[#AD647D] text-white border-[#AD647D] font-bold shadow-xs'
                                    : 'bg-[#FFF9FA] hover:bg-[#F8DDE6]/50 text-[#4A2030] border-[#F8DDE6]'
                                }`}
                              >
                                <span>{item.name}</span>
                                {item.badge && (
                                  <span className={`text-[9px] px-1 rounded-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 text-[#AD647D]'}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A2030] mb-1">
                        العنوان التفصيلي أو رقم المبنى <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="الشارع، رقم العمارة أو الفيلا، أو رابط الموقع"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4]"
                      />
                    </div>

                    {/* Date & Time Slot (2 to 5 days delivery) */}
                    <div className="space-y-2.5">
                      <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <strong className="block">موعد التوصيل والاستلام المعتمد: خلال 2 إلى 5 أيام</strong>
                          <span className="text-[10px] text-amber-800">
                            يتم تجهيز وقطف الزهور بدقة وحفظها بأعلى معايير النضارة قبل التسليم مباشرة بمكة المكرمة.
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#4A2030] mb-1">
                            تاريخ التوصيل والاستلام (من يومين إلى 5 أيام) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            min={minDeliveryDate}
                            max={maxDeliveryDate}
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4] font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4A2030] mb-1">
                            فترة الاستلام والتسليم
                          </label>
                          <select
                            value={deliveryTimeSlot}
                            onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                            className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4]"
                          >
                            <option value="صباحي (9:00 ص - 1:00 م)">صباحي (9:00 ص - 1:00 م)</option>
                            <option value="مسائي (4:00 م - 8:00 م)">مسائي (4:00 م - 8:00 م)</option>
                            <option value="ليلي (8:00 م - 11:30 م)">ليلي (8:00 م - 11:30 م)</option>
                          </select>
                        </div>
                      </div>

                      {/* Quick Date Select Chips */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500">اختر موعد الاستلام السريع:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { days: 2, label: 'خلال يومين (بعد غد)', badge: '🌸 الأقرب' },
                            { days: 3, label: 'خلال 3 أيام' },
                            { days: 4, label: 'خلال 4 أيام' },
                            { days: 5, label: 'خلال 5 أيام' }
                          ].map((item) => {
                            const targetDate = getDateOffset(item.days);
                            const isSelected = deliveryDate === targetDate;
                            return (
                              <button
                                key={item.days}
                                type="button"
                                onClick={() => setDeliveryDate(targetDate)}
                                className={`text-[10px] px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-[#AD647D] text-white border-[#AD647D] font-bold shadow-xs'
                                    : 'bg-[#FFF9FA] hover:bg-[#F8DDE6]/50 text-[#4A2030] border-[#F8DDE6]'
                                }`}
                              >
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span className={`text-[9px] px-1 rounded-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 text-[#AD647D]'}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Overall Gift Message */}
                    <div>
                      <label className="block text-xs font-bold text-[#4A2030] mb-1">
                        رسالة كرت الإهداء العامة (اختياري)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="اكتب العبارة التي تود طباعتها على كرت الإهداء الملكي..."
                        value={giftCardMessage}
                        onChange={(e) => setGiftCardMessage(e.target.value)}
                        className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#E7A0B4] resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-2 px-4 border border-[#F8DDE6] text-[#AD647D] text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition"
                    >
                      <span>التالي: تأكيد الدفع عند الاستلام</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Payment (COD Only) & Summary */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#4A2030] mb-2">
                      طريقة الدفع المعتمدة:
                    </label>

                    {/* Exclusive COD Card */}
                    <div className="p-4 rounded-2xl border-2 border-[#AD647D] bg-gradient-to-br from-[#FFF9FA] via-[#FFF0F4] to-white shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#AD647D] text-white flex items-center justify-center shadow-xs shrink-0">
                            <Truck className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#2D141E]">الدفع عند الاستلام فقط (COD)</h4>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                الخيار المعتمد الوحيد
                              </span>
                            </div>
                            <p className="text-xs text-[#AD647D] font-medium pt-0.5">
                              ادفع نقدًا (كاش) أو عبر جهاز نقاط البيع (مدى / بطاقة بنكية) مع المندوب عند استلام باقتك
                            </p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#AD647D] text-white flex items-center justify-center text-xs shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>

                      {/* Guarantees List */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-pink-100 text-[11px] text-[#4A2030]">
                        <div className="flex items-center gap-1.5 p-2 bg-white/80 rounded-xl border border-pink-100">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>بدون أي دفع إلكتروني مسبق</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-white/80 rounded-xl border border-pink-100">
                          <Eye className="w-4 h-4 text-[#C9A46A] shrink-0" />
                          <span>افحص وتأكد من باقتك أولاً</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-white/80 rounded-xl border border-pink-100">
                          <Clock className="w-4 h-4 text-[#AD647D] shrink-0" />
                          <span>التسليم خلال من يومين إلى 5 أيام</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-[#FFF9FA] rounded-2xl border border-[#F8DDE6] space-y-2 text-xs">
                    <div className="font-bold text-[#AD647D] border-b border-pink-100 pb-1.5 flex justify-between">
                      <span>ملخص الفاتورة</span>
                      <span>({cart.length} منتجات)</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>المجموع الفرعي:</span>
                      <span className="font-semibold">{cartSubtotal} ر.س</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>الخصم ({appliedCoupon?.code}):</span>
                        <span>-{discountAmount} ر.س</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>رسوم التوصيل ({deliveryCity}):</span>
                      <span className="font-semibold">
                        {isFreeDelivery ? 'مجاناً (تجاوز 350 ر.س)' : `${deliveryFee} ر.س`}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-black text-[#2D141E] pt-2 border-t border-pink-100">
                      <span>الإجمالي المطلوب عند الاستلام:</span>
                      <span className="text-base text-[#AD647D]">{total} ر.س</span>
                    </div>
                    <div className="text-[10px] text-gray-400 text-left">
                      * السعر شامل ضريبة القيمة المضافة 15% • لا توجد أي رسوم إضافية على الدفع عند الاستلام
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-2 px-4 border border-[#F8DDE6] text-[#AD647D] text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitOrder}
                      className="py-3.5 px-8 bg-gradient-to-r from-[#E7A0B4] via-[#AD647D] to-[#AD647D] hover:brightness-105 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري تأكيد الطلب وحفظه...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>تأكيد الطلب • الدفع عند الاستلام ({total} ر.س)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
