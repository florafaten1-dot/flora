import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Star, 
  Check, 
  AlertCircle, 
  Scale, 
  Sparkles,
  Flower2,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductDetails?: (product: Product) => void;
  onOpenCart?: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  onOpenProductDetails,
  onOpenCart
}) => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    products, 
    addToCart 
  } = useStore();

  if (!isOpen) return null;

  const compareProducts = compareList
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const flowerTypeLabels: Record<string, string> = {
    natural: '🌸 طبيعي هولندي فاخر',
    artificial: '🌿 ورد حريري دائم',
    mix: '💐 تشكيلة ورد طبيعي ومجفف'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F8DDE6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#F8DDE6] bg-gradient-to-r from-[#FFF5F7] via-[#FFF9FA] to-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center border border-[#F8DDE6]">
              <Scale className="w-5 h-5 text-[#C9A46A]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#2D141E] font-serif-lux flex items-center gap-2">
                <span>مقارنة الباقات والمنتجات</span>
                <span className="text-xs bg-[#AD647D] text-white px-2 py-0.5 rounded-full font-sans">
                  {compareProducts.length} / 3
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#5D2B3D]/70">
                مقارنة دقيقة وشفافة للأسعار، الأحجام، نوع الزهور، والتقييمات لاختيار هديتك المثالية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProducts.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="hidden sm:flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold"
                title="مسح كافة المنتجات من المقارنة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح المقارنة</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-pink-100 text-[#AD647D] border border-[#F8DDE6] flex items-center justify-center transition cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {compareProducts.length === 0 ? (
            <div className="py-12 sm:py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto border border-[#F8DDE6]">
                <Scale className="w-8 h-8 text-[#C9A46A]" />
              </div>
              <h3 className="text-base font-bold text-[#2D141E]">لا توجد باقات في جدول المقارنة حالياً</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                انقر على أيقونة الميزان ⚖️ في بطاقات الباقات لإضافتها إلى المقارنة والمفاضلة بين الأسعار والمقاسات.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-full bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                تصفح الباقات الآن
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[580px] grid grid-cols-3 gap-4 sm:gap-6">
                {compareProducts.map((prod) => {
                  const effectivePrice = prod.salePrice ?? prod.price;
                  const hasDiscount = Boolean(prod.salePrice && prod.salePrice < prod.price);

                  return (
                    <div 
                      key={prod.id} 
                      className="bg-[#FFFDFD] border border-[#F8DDE6] rounded-3xl p-4 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition relative group"
                    >
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCompare(prod.id)}
                        className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#F8DDE6] flex items-center justify-center transition shadow-2xs z-10 cursor-pointer"
                        title="إزالة من المقارنة"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Product Thumbnail & Category */}
                      <div>
                        <div 
                          className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FFF9FA] mb-3 relative cursor-pointer group"
                          onClick={() => {
                            if (onOpenProductDetails) {
                              onOpenProductDetails(prod);
                              onClose();
                            }
                          }}
                        >
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-[#FFF0F4] text-[#AD647D] p-2 text-center">
                              <Sparkles className="w-6 h-6 text-[#C9A46A] mb-1" />
                              <span className="text-[10px] font-bold text-[#4A2030]">بانتظار الصورة</span>
                            </div>
                          )}
                          {hasDiscount && (
                            <span className="absolute bottom-2 right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                              خصم خاص
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-[#C9A46A] block">
                          {prod.categoryName || 'باقة ورد فاخرة'}
                        </span>
                        
                        <h4 
                          className="text-sm font-black text-[#2D141E] font-serif-lux line-clamp-1 hover:text-[#AD647D] transition cursor-pointer mt-0.5"
                          onClick={() => {
                            if (onOpenProductDetails) {
                              onOpenProductDetails(prod);
                              onClose();
                            }
                          }}
                        >
                          {prod.name}
                        </h4>

                        {/* Price Badge */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-black text-[#AD647D]">
                            {effectivePrice} ر.س
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {prod.price} ر.س
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comparison Attributes Table */}
                      <div className="space-y-2.5 text-xs border-t border-pink-100 pt-3">
                        {/* 1. Rating */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-[11px]">التقييم:</span>
                          <span className="font-bold text-[#2D141E] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#C9A46A] text-[#C9A46A]" />
                            <span>{(prod.rating || 5).toFixed(1)}</span>
                            <span className="text-[10px] text-gray-400 font-normal">({prod.reviewsCount || 0})</span>
                          </span>
                        </div>

                        {/* 2. Stock / Availability */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-[11px]">التوفر:</span>
                          <span className={`text-[11px] font-bold flex items-center gap-1 ${
                            prod.stock > 0 ? 'text-emerald-700' : 'text-red-500'
                          }`}>
                            {prod.stock > 0 ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>متوفر للطلب الفوري</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-red-500" />
                                <span>نفدت الكمية</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* 3. Flower Type */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-[11px]">نوع الورد:</span>
                          <span className="font-bold text-[11px] text-[#4A2030]">
                            {flowerTypeLabels[prod.flowerType] || 'طبيعي هولندي'}
                          </span>
                        </div>

                        {/* 4. Sizes */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-[11px]">المقاسات:</span>
                          <span className="font-bold text-[11px] text-[#4A2030]">
                            {prod.sizes && prod.sizes.length > 0 
                              ? `${prod.sizes.length} أحجام متاحة` 
                              : 'مقاس قياسي موحد'}
                          </span>
                        </div>

                        {/* 5. Addons & Chocolates */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-[11px]">الإضافات:</span>
                          <span className="font-bold text-[11px] text-[#4A2030]">
                            {prod.addons && prod.addons.length > 0 
                              ? `${prod.addons.length} إضافات متوفرة` 
                              : 'شوكولاتة وكروت اختيارية'}
                          </span>
                        </div>

                        {/* 6. Wax Greeting Card */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-[11px]">كرت الإهداء:</span>
                          <span className="font-bold text-[11px] text-emerald-700 flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            <span>متاح مجاناً مع رسالتك</span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(prod, 1);
                            if (onOpenCart) onOpenCart();
                          }}
                          disabled={prod.stock === 0}
                          className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer ${
                            prod.stock === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-[#AD647D] hover:bg-[#8C465F] text-white active:scale-95'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>إضافة إلى السلة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenProductDetails) {
                              onOpenProductDetails(prod);
                              onClose();
                            }
                          }}
                          className="w-full py-2 px-3 rounded-2xl border border-[#F8DDE6] hover:bg-pink-50 text-xs font-bold text-[#AD647D] transition cursor-pointer"
                        >
                          عرض تفاصيل الباقة
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {compareProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#F8DDE6] bg-[#FFF9FA] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-gray-500 text-center sm:text-right">
              {compareProducts.length < 3 ? (
                <span>يمكنك إضافة <strong>{3 - compareProducts.length}</strong> باقة أخرى للمقارنة.</span>
              ) : (
                <span className="text-emerald-700 font-bold">تم الوصول للحد الأقصى (3 باقات).</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={clearCompare}
                className="sm:hidden flex-1 py-2 px-4 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition"
              >
                مسح الكل
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none py-2 px-6 rounded-xl bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold transition shadow-xs"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
