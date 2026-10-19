import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Gift, 
  Check, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  MessageSquare,
  Flower2,
  Send,
  User as UserIcon,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, ProductSize, ProductAddon, ProductReview } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOpenCart
}) => {
  const { 
    products,
    addToCart, 
    isInWishlist, 
    toggleWishlist,
    getProductReviews,
    addProductReview,
    currentUser,
    userProfile
  } = useStore();

  if (!product) return null;

  // Track live product with updated rating & reviewsCount
  const liveProduct = products.find(p => p.id === product.id) || product;
  const productReviews = getProductReviews(liveProduct.id);

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Active selected image from gallery
  const galleryImages = React.useMemo(() => {
    return Array.from(new Set([liveProduct.image, ...(liveProduct.images || [])])).filter(Boolean);
  }, [liveProduct]);
  const [selectedImage, setSelectedImage] = useState<string>(liveProduct.image);

  // Selected variations
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    liveProduct.sizes && liveProduct.sizes.length > 0 ? liveProduct.sizes[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Reset variation state when product changes
  useEffect(() => {
    setSelectedImage(liveProduct.image);
    setSelectedSize(liveProduct.sizes && liveProduct.sizes.length > 0 ? liveProduct.sizes[0] : undefined);
    setSelectedAddons([]);
    setQuantity(1);
    setGiftCardMessage('');
    setRecipientName('');
    setActiveTab('details');
  }, [liveProduct.id]);

  // Complementary suggested items (Cross-sell: chocolates, balloons, teddy, complementary gifts)
  const [addedCompId, setAddedCompId] = useState<string | null>(null);
  const suggestedComplementaryProducts = React.useMemo(() => {
    return products
      .filter(p => 
        p.id !== liveProduct.id && 
        p.stock > 0 &&
        (p.category === 'chocolates-treats' || p.category === 'balloons-party' || p.category === 'occasions-gifts' || p.category === liveProduct.category)
      )
      .slice(0, 2);
  }, [products, liveProduct]);

  const handleAddComplementary = (compProduct: Product) => {
    addToCart(compProduct, 1);
    setAddedCompId(compProduct.id);
    setTimeout(() => setAddedCompId(null), 2500);
  };

  // Review Form State
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');

  // Filtered reviews based on active star filter
  const displayedReviews = React.useMemo(() => {
    if (selectedRatingFilter === 'all') return productReviews;
    return productReviews.filter(r => r.rating === selectedRatingFilter);
  }, [productReviews, selectedRatingFilter]);

  // Pre-fill user name if logged in
  useEffect(() => {
    if (userProfile?.displayName) {
      setUserNameInput(userProfile.displayName);
    } else if (currentUser?.displayName) {
      setUserNameInput(currentUser.displayName);
    }
  }, [userProfile, currentUser]);

  // Dynamic price calculation
  const basePrice = liveProduct.salePrice ?? liveProduct.price;
  const sizeDelta = selectedSize?.priceDelta || 0;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = basePrice + sizeDelta + addonsTotal;
  const totalPrice = unitPrice * quantity;

  // Toggle addons
  const handleToggleAddon = (addon: ProductAddon) => {
    setSelectedAddons(prev => 
      prev.some(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    const fullCardText = giftCardMessage.trim() 
      ? `${recipientName ? `إلى: ${recipientName}\n` : ''}${giftCardMessage}`
      : undefined;

    addToCart(liveProduct, quantity, selectedSize, selectedAddons, fullCardText);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2500);
  };

  // Submit new review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);

    if (!userNameInput.trim()) {
      setReviewError('يرجى كتابة اسمك الكريم لإتمام التقييم');
      return;
    }

    if (!commentInput.trim() || commentInput.trim().length < 4) {
      setReviewError('يرجى كتابة تعليق لا يقل عن 4 أحرف لمشاركة تجربتك');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await addProductReview({
        productId: liveProduct.id,
        rating: ratingInput,
        comment: commentInput.trim(),
        userName: userNameInput.trim(),
        userEmail: currentUser?.email || undefined
      });

      setCommentInput('');
      setReviewSubmitSuccess(true);
      setTimeout(() => {
        setReviewSubmitSuccess(false);
      }, 4000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setReviewError(err?.message || 'تعذر إرسال التقييم حالياً، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Calculate average rating
  const avgRatingNumber = liveProduct.rating ? Number(liveProduct.rating) : 5.0;
  const totalReviewsCount = productReviews.length > 0 ? productReviews.length : (liveProduct.reviewsCount || 0);

  // Rating breakdown stats
  const ratingCounts = {
    5: productReviews.filter(r => r.rating === 5).length,
    4: productReviews.filter(r => r.rating === 4).length,
    3: productReviews.filter(r => r.rating === 3).length,
    2: productReviews.filter(r => r.rating === 2).length,
    1: productReviews.filter(r => r.rating === 1).length,
  };

  const ratingDescriptions: { [key: number]: string } = {
    1: 'نجمة واحدة - بحاجة لتحسين',
    2: 'نجمتان - مقبول',
    3: '3 نجوم - جيد',
    4: '4 نجوم - رائع ومميز ✨',
    5: '5 نجوم - ممتاز واستثنائي 🌸'
  };

  const activeStarCount = hoverRating > 0 ? hoverRating : ratingInput;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#F8DDE6] overflow-hidden my-8 max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/90 text-[#AD647D] hover:bg-[#F8DDE6] transition flex items-center justify-center shadow-md cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery & Badges */}
        <div className="w-full md:w-1/2 bg-[#FFF9FA] p-5 sm:p-6 flex flex-col justify-between relative border-b md:border-b-0 md:border-l border-[#F8DDE6]">
          <div>
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-xs border border-[#F8DDE6] bg-white">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={liveProduct.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FFF5F8] via-[#FDF0F4] to-[#FCE6EE] select-none">
                  <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center mb-3 text-[#C9A46A] border border-pink-100">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <span className="font-extrabold text-[#4A2030] text-sm mb-1">{liveProduct.name}</span>
                  <span className="text-xs text-[#AD647D] bg-white/80 px-3 py-1 rounded-full border border-pink-100 shadow-2xs font-medium">
                    بانتظار إضافة الصورة
                  </span>
                </div>
              )}

              {/* Floating Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 items-end">
                <span className="bg-[#AD647D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {liveProduct.flowerType === 'natural' 
                    ? '🌸 ورود طبيعية هولندية قطف يومي' 
                    : liveProduct.flowerType === 'artificial'
                    ? '✨ ورود صناعية فاخرة دائمة'
                    : '🌿 تشكيلة مختارة فاخرة'}
                </span>

                {liveProduct.salePrice && (
                  <span className="bg-[#A63A50] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
                    خصم {Math.round(((liveProduct.price - liveProduct.salePrice) / liveProduct.price) * 100)}%
                  </span>
                )}

                {liveProduct.isBestSeller && (
                  <span className="bg-gradient-to-r from-[#C9A46A] to-[#DFBA80] text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> الأكثر طلباً
                  </span>
                )}
              </div>

              {/* In Wishlist Indicator */}
              <button
                onClick={() => toggleWishlist(liveProduct.id)}
                className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#AD647D] hover:text-rose-500 transition cursor-pointer"
                aria-label="إضافة للمفضلة"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(liveProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip if multiple images exist */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      selectedImage === imgUrl ? 'border-[#AD647D] ring-2 ring-[#AD647D]/30 scale-105' : 'border-[#F8DDE6] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${liveProduct.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {/* Quick Average Review Pill on image column */}
            <div className="p-3 bg-white rounded-2xl border border-[#F8DDE6] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[#C9A46A]">
                  <Star className="w-4 h-4 fill-[#C9A46A]" />
                  <span className="text-sm font-black text-[#2D141E]">{avgRatingNumber.toFixed(1)}</span>
                </div>
                <span className="text-xs text-[#5D2B3D]/70 font-medium">
                  تقييم العملاء ({totalReviewsCount} تقييم)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="text-xs font-bold text-[#AD647D] hover:underline cursor-pointer"
              >
                عرض الآراء
              </button>
            </div>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5D2B3D]">
              <div className="p-2.5 rounded-xl bg-white border border-[#F8DDE6] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#AD647D] shrink-0" />
                <span>تجهيز وتوصيل مجدول (2 - 5 أيام) بمكة</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#F8DDE6] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A46A] shrink-0" />
                <span>ضمان نضارة الزهور 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Navigation & Content */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-5 min-w-0">
          
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-[#C9A46A] font-semibold">
              <span>{liveProduct.categoryName || 'فلورا فاتن'}</span>
              
              {/* Clickable Star Rating that switches to reviews */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'reviews' ? 'details' : 'reviews')}
                className="flex items-center gap-1.5 bg-[#FFF0F4] hover:bg-[#F8DDE6] px-2.5 py-1 rounded-full text-[#AD647D] transition cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-[#C9A46A] text-[#C9A46A]" />
                <span className="font-bold">{avgRatingNumber.toFixed(1)}</span>
                <span className="text-[10px] text-[#5D2B3D]/70 font-normal">({totalReviewsCount} تقييم)</span>
              </button>
            </div>

            <h2 className="text-xl font-bold text-[#2D141E] mt-1 font-serif-lux">
              {liveProduct.name}
            </h2>

            {/* Navigation Tabs (Details vs Reviews) */}
            <div className="flex border-b border-[#F8DDE6] mt-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#AD647D] text-[#AD647D]'
                    : 'border-transparent text-gray-500 hover:text-[#4A2030]'
                }`}
              >
                <Flower2 className="w-3.5 h-3.5" />
                <span>تفاصيل الباقة وتخصيصها</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#AD647D] text-[#AD647D]'
                    : 'border-transparent text-gray-500 hover:text-[#4A2030]'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>التقييمات والآراء</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'reviews' ? 'bg-[#AD647D] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {totalReviewsCount}
                </span>
              </button>
            </div>

            {/* TAB 1: PRODUCT DETAILS & CUSTOMIZATION */}
            {activeTab === 'details' && (
              <div className="mt-4 space-y-5 animate-fadeIn">
                {/* Product Description */}
                <p className="text-xs sm:text-sm text-[#5D2B3D]/85 leading-relaxed">
                  {liveProduct.description}
                </p>

                {/* Pricing & Stock Status Banner */}
                <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">السعر الأساسي للباقة</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-[#AD647D]">
                        {liveProduct.salePrice ?? liveProduct.price}
                      </span>
                      <span className="text-xs font-bold text-[#AD647D]">ر.س</span>
                      {liveProduct.salePrice && (
                        <span className="text-xs text-gray-400 line-through mr-1">
                          {liveProduct.price} ر.س
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left">
                    {liveProduct.stock > 0 ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>متوفر للتجهيز والتوصيل</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                        نفدت الكمية حالياً
                      </span>
                    )}
                  </div>
                </div>

                {/* Sizes Selection */}
                {liveProduct.sizes && liveProduct.sizes.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#AD647D] mb-2 flex items-center justify-between">
                      <span>اختر حجم الباقة أو التنسيق:</span>
                      <span className="text-[11px] text-[#C9A46A] font-semibold">
                        {selectedSize ? selectedSize.name : 'الحجم الافتراضي'}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {liveProduct.sizes.map((s) => {
                        const isSelected = selectedSize?.id === s.id;
                        const sizeTotalPrice = basePrice + s.priceDelta;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`p-3 rounded-2xl border text-xs text-right transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF0F4] border-[#AD647D] text-[#AD647D] font-bold shadow-xs ring-2 ring-[#AD647D]/20'
                                : 'border-[#F8DDE6] hover:bg-pink-50/40 text-[#4A2030]'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold">{s.name}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#AD647D] bg-[#AD647D] text-white' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-pink-100/50">
                              <span className="text-gray-500 font-normal">
                                {s.priceDelta > 0 ? `+${s.priceDelta} ر.س` : 'بدون زيادة'}
                              </span>
                              <span className="font-black text-[#AD647D]">
                                {sizeTotalPrice} ر.س
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Addons Selection */}
                {liveProduct.addons && liveProduct.addons.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#AD647D] mb-2 flex items-center justify-between">
                      <span>إضافات فاخرة وتوزيعات مع الباقة:</span>
                      <span className="text-[10px] text-gray-500 font-normal">
                        {selectedAddons.length > 0 ? `تم تحديد (${selectedAddons.length})` : 'اختياري'}
                      </span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {liveProduct.addons.map((addon) => {
                        const isChecked = selectedAddons.some(a => a.id === addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => handleToggleAddon(addon)}
                            className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-[#FFF0F4] border-[#AD647D] text-[#AD647D] font-bold shadow-2xs'
                                : 'border-[#F8DDE6] hover:bg-[#FFF9FA] text-[#4A2030]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                                isChecked ? 'bg-[#AD647D] border-[#AD647D] text-white' : 'border-gray-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs">{addon.icon || '🎁'} {addon.name}</span>
                            </div>
                            <span className="font-black text-[#C9A46A] text-[11px] shrink-0">
                              +{addon.price} ر.س
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gift Card Message Section */}
                <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#AD647D]">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#C9A46A]" />
                      <span>رسالة كرت الإهداء (مجاناً بختم شمعي أنيق):</span>
                    </div>
                    <span className="text-[10px] text-[#C9A46A] font-normal">هدية مجانية ⚜️</span>
                  </div>

                  <input
                    type="text"
                    placeholder="اسم المستلم (مثال: نورة، أمي الغالية، عروستنا...)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs bg-white border border-[#F8DDE6] rounded-xl py-2 px-3 focus:outline-hidden focus:border-[#AD647D] transition shadow-2xs"
                  />

                  <textarea
                    rows={2}
                    placeholder="اكتب عبارة الإهداء من القلب..."
                    value={giftCardMessage}
                    onChange={(e) => setGiftCardMessage(e.target.value)}
                    className="w-full text-xs bg-white border border-[#F8DDE6] rounded-xl py-2 px-3 focus:outline-hidden focus:border-[#AD647D] transition resize-none shadow-2xs"
                  />

                  {/* Wax Seal Card Preview */}
                  {giftCardMessage.trim() && (
                    <div className="p-3.5 bg-gradient-to-br from-[#FFFDFD] to-[#FFF5F7] rounded-xl border border-dashed border-[#C9A46A] text-center font-serif-lux text-xs relative shadow-xs animate-fadeIn">
                      <div className="text-[10px] text-[#C9A46A] font-bold tracking-widest uppercase mb-1">
                        ⚜️ كرت الإهداء الملكي المختوم ⚜️
                      </div>
                      {recipientName && (
                        <div className="font-bold text-[#AD647D] mb-1">إلى / {recipientName}</div>
                      )}
                      <p className="italic text-[#4A2030] leading-relaxed font-medium">"{giftCardMessage}"</p>
                      <div className="text-[9px] text-[#AD647D]/60 mt-1 font-sans">
                        مختوم يدوياً بالشمع الوردي الفاخر مع باقتك 💌
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculation Transparency Breakdown Box */}
                <div className="p-3 bg-white rounded-2xl border border-[#F8DDE6] text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-gray-500 text-[11px]">
                    <span>سعر الباقة الأساسي:</span>
                    <span className="font-bold text-[#2D141E]">{basePrice} ر.س</span>
                  </div>
                  {selectedSize && selectedSize.priceDelta > 0 && (
                    <div className="flex items-center justify-between text-gray-500 text-[11px]">
                      <span>فرق حجم الباقة ({selectedSize.name}):</span>
                      <span className="font-bold text-[#C9A46A]">+{selectedSize.priceDelta} ر.س</span>
                    </div>
                  )}
                  {selectedAddons.length > 0 && (
                    <div className="flex items-center justify-between text-gray-500 text-[11px]">
                      <span>الإضافات الفاخرة ({selectedAddons.length}):</span>
                      <span className="font-bold text-[#C9A46A]">+{addonsTotal} ر.س</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[#AD647D] font-bold pt-1.5 border-t border-[#F8DDE6]/60">
                    <span>سعر الباقة المفردة بالتخصيص:</span>
                    <span>{unitPrice} ر.س</span>
                  </div>
                </div>

                {/* SUGGESTED COMPLEMENTARY PRODUCTS (Chocolates, Balloons, Vases, Gift Sets) */}
                {suggestedComplementaryProducts.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-pink-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#AD647D] flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#C9A46A]" />
                        <span>منتجات مكملة ومقترحة مع هذه الباقة:</span>
                      </span>
                      <span className="text-[10px] text-gray-400">إضافة فورية للسلة</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedComplementaryProducts.map((comp) => {
                        const isAdded = addedCompId === comp.id;
                        return (
                          <div 
                            key={comp.id}
                            className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl p-2.5 flex items-center justify-between gap-2.5 hover:border-[#E7A0B4] transition shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {comp.image ? (
                                <img 
                                  src={comp.image} 
                                  alt={comp.name} 
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-pink-100" 
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-xl bg-pink-50 border border-pink-100 shrink-0 flex items-center justify-center text-[#C9A46A]">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-bold text-[#2D141E] truncate">{comp.name}</h5>
                                <span className="text-[11px] font-black text-[#AD647D]">
                                  {comp.salePrice ?? comp.price} ر.س
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddComplementary(comp)}
                              className={`shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                                isAdded 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-white border border-[#F8DDE6] text-[#AD647D] hover:bg-[#AD647D] hover:text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>تمت الإضافة!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>أضف للسلة</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Banner calling customer to reviews */}
                <div 
                  onClick={() => setActiveTab('reviews')}
                  className="p-3 bg-gradient-to-r from-pink-50 to-[#FFF9FA] rounded-2xl border border-pink-100 flex items-center justify-between cursor-pointer hover:border-[#E7A0B4] transition"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Star className="w-4 h-4 fill-[#C9A46A] text-[#C9A46A]" />
                    <span className="font-bold text-[#2D141E]">
                      تقييم العملاء: {avgRatingNumber.toFixed(1)} من 5
                    </span>
                    <span className="text-[11px] text-[#5D2B3D]/70">
                      ({totalReviewsCount} تقييم)
                    </span>
                  </div>
                  <span className="text-xs text-[#AD647D] font-bold">
                    قراءة الآراء أو إضافة تقييم ←
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: REVIEWS & RATINGS */}
            {activeTab === 'reviews' && (
              <div className="mt-4 space-y-6 animate-fadeIn">
                
                {/* 1. Rating Overview & Breakdown */}
                <div className="bg-[#FFF9FA] p-4 rounded-2xl border border-[#F8DDE6]">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Big Score */}
                    <div className="text-center sm:text-right shrink-0">
                      <div className="text-3xl sm:text-4xl font-black text-[#2D141E] flex items-center justify-center sm:justify-start gap-1 font-serif-lux">
                        <span>{avgRatingNumber.toFixed(1)}</span>
                        <span className="text-sm font-medium text-[#5D2B3D]/60">/ 5</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <Star 
                            key={starVal} 
                            className={`w-4 h-4 ${
                              starVal <= Math.round(avgRatingNumber) 
                                ? 'fill-[#C9A46A] text-[#C9A46A]' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#5D2B3D]/70 block">
                        بناءً على {totalReviewsCount} تجربة وتقييم
                      </span>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="flex-1 w-full space-y-1.5 border-t sm:border-t-0 sm:border-r border-[#F8DDE6] pt-3 sm:pt-0 sm:pr-4">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
                        const pct = productReviews.length > 0 
                          ? Math.round((count / productReviews.length) * 100) 
                          : (stars === 5 ? 90 : (stars === 4 ? 10 : 0));
                        return (
                          <div key={stars} className="flex items-center gap-2 text-[11px]">
                            <span className="w-10 text-gray-500 font-medium flex items-center gap-0.5">
                              {stars} <Star className="w-2.5 h-2.5 fill-[#C9A46A] text-[#C9A46A]" />
                            </span>
                            <div className="flex-1 h-2 bg-pink-100/60 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#E7A0B4] to-[#C9A46A] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-left text-gray-400 text-[10px]">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Trust Guarantees Bar for Customer Confidence */}
                <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] text-[#4A2030] font-semibold text-center">
                  <div className="p-2.5 rounded-2xl bg-white border border-[#F8DDE6] flex flex-col sm:flex-row items-center justify-center gap-1.5 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>نضارة الزهور 100%</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#F8DDE6] flex flex-col sm:flex-row items-center justify-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-[#C9A46A] shrink-0" />
                    <span>تطابق تام مع الصور</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#F8DDE6] flex flex-col sm:flex-row items-center justify-center gap-1.5 shadow-2xs">
                    <Truck className="w-4 h-4 text-[#AD647D] shrink-0" />
                    <span>توصيل دقيق بمكة</span>
                  </div>
                </div>

                {/* 2. Add New Review Form */}
                <form 
                  onSubmit={handleReviewSubmit}
                  className="bg-white p-4 rounded-2xl border border-[#F8DDE6] shadow-2xs space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#AD647D]">
                      <Sparkles className="w-4 h-4 text-[#C9A46A]" />
                      <span>شاركنا رأيك وتقييمك للباقة</span>
                    </div>
                    <span className="text-[10px] text-gray-400">تقييم معتمد</span>
                  </div>

                  {/* Interactive Star Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D141E] mb-1.5">
                      اختر عدد النجوم:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#FFF9FA] px-3 py-1.5 rounded-xl border border-[#F8DDE6]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                            aria-label={`${star} نجوم`}
                          >
                            <Star 
                              className={`w-6 h-6 transition-colors ${
                                star <= activeStarCount
                                  ? 'fill-[#C9A46A] text-[#C9A46A]' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-[#AD647D] animate-fadeIn">
                        {ratingDescriptions[activeStarCount]}
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D141E] mb-1">
                      اسمك الكريم:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userNameInput}
                        onChange={(e) => setUserNameInput(e.target.value)}
                        placeholder="مثال: سارة الشريف"
                        required
                        className="w-full text-xs bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 pr-8 pl-3 focus:outline-hidden focus:border-[#E7A0B4] text-[#2D141E]"
                      />
                      <UserIcon className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D141E] mb-1">
                      نص التقييم والملاحظات:
                    </label>
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="صف لنا تجربتك مع الباقة، نضارة الزهور، دقة التوصيل في مكة، وفخامة التغليف..."
                      required
                      className="w-full text-xs bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl p-3 focus:outline-hidden focus:border-[#E7A0B4] text-[#2D141E] resize-none"
                    />
                  </div>

                  {/* Alerts */}
                  {reviewError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {reviewSubmitSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>شكراً لك! تم تسجيل تقييمك بنجاح وحساب متوسط تقييم المنتج 🌸</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] hover:brightness-105 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isSubmittingReview ? (
                      <span>جاري إرسال التقييم...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال التقييم واعتماده 🌸</span>
                      </>
                    )}
                  </button>
                </form>

                {/* 3. Customer Reviews List with Star Filter */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-2">
                    <h4 className="text-xs font-bold text-[#2D141E] flex items-center gap-1.5">
                      <span>تجارب وآراء العملاء ({productReviews.length}):</span>
                      {selectedRatingFilter !== 'all' && (
                        <span className="text-[10px] text-[#AD647D] font-medium">
                          (معروض {displayedReviews.length} من أصل {productReviews.length})
                        </span>
                      )}
                    </h4>

                    {/* Filter Pills */}
                    {productReviews.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRatingFilter('all')}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition whitespace-nowrap cursor-pointer ${
                            selectedRatingFilter === 'all'
                              ? 'bg-[#AD647D] text-white shadow-2xs'
                              : 'bg-white border border-[#F8DDE6] text-gray-600 hover:bg-pink-50'
                          }`}
                        >
                          الكل ({productReviews.length})
                        </button>
                        {[5, 4, 3, 2, 1].map((starNum) => {
                          const count = ratingCounts[starNum as keyof typeof ratingCounts] || 0;
                          if (count === 0) return null;
                          return (
                            <button
                              key={starNum}
                              type="button"
                              onClick={() => setSelectedRatingFilter(starNum)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition whitespace-nowrap flex items-center gap-0.5 cursor-pointer ${
                                selectedRatingFilter === starNum
                                  ? 'bg-[#AD647D] text-white shadow-2xs'
                                  : 'bg-white border border-[#F8DDE6] text-gray-600 hover:bg-pink-50'
                              }`}
                            >
                              <span>{starNum}</span>
                              <Star className="w-2.5 h-2.5 fill-[#C9A46A] text-[#C9A46A]" />
                              <span>({count})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {productReviews.length === 0 ? (
                    <div className="p-6 text-center bg-[#FFF9FA] rounded-2xl border border-dashed border-[#F8DDE6] space-y-2">
                      <MessageSquare className="w-8 h-8 text-[#E7A0B4] mx-auto opacity-70" />
                      <p className="text-xs font-bold text-[#2D141E]">
                        لا توجد تقييمات مكتوبة بعد لهذه الباقة
                      </p>
                      <p className="text-[11px] text-[#5D2B3D]/70 max-w-xs mx-auto">
                        كن أول عميل يشارك رأيه وتجربته ويضيف تقييماً لمساعدة الآخرين!
                      </p>
                    </div>
                  ) : displayedReviews.length === 0 ? (
                    <div className="p-6 text-center bg-[#FFF9FA] rounded-2xl border border-dashed border-[#F8DDE6] space-y-2">
                      <p className="text-xs font-bold text-[#2D141E]">
                        لا توجد تقييمات بدرجة ({selectedRatingFilter} نجوم) حالياً
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedRatingFilter('all')}
                        className="text-xs text-[#AD647D] font-bold hover:underline cursor-pointer"
                      >
                        عرض جميع التقييمات ({productReviews.length})
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayedReviews.map((rev) => (
                        <div 
                          key={rev.id} 
                          className="p-3.5 rounded-2xl bg-white border border-[#F8DDE6] shadow-2xs space-y-2"
                        >
                          {/* Review Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              {/* Avatar circle */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] text-[#AD647D] font-bold text-xs flex items-center justify-center shadow-2xs">
                                {rev.userName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#2D141E]">{rev.userName}</span>
                                  {rev.verifiedPurchase && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                      <Check className="w-2.5 h-2.5" /> عميل موثّق
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {new Date(rev.createdAt).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating 
                                      ? 'fill-[#C9A46A] text-[#C9A46A]' 
                                      : 'text-gray-200'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>

                          {/* Comment Text */}
                          <p className="text-xs text-[#4A2030] leading-relaxed pt-1 pr-1 border-t border-pink-50/50">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Bottom Bar: Quantity, Dynamic Price & Add to Cart */}
          <div className="pt-4 border-t border-[#F8DDE6] space-y-3 bg-white sticky bottom-0 z-10">
            <div className="flex items-center justify-between">
              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 border border-[#F8DDE6] rounded-2xl p-1 bg-[#FFF9FA]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white text-[#AD647D] hover:bg-[#AD647D] hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-black text-[#2D141E]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white text-[#AD647D] hover:bg-[#AD647D] hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Live Final Calculated Total Price */}
              <div className="text-left">
                <span className="text-[10px] text-gray-500 font-medium block">
                  {quantity > 1 ? `الإجمالي لـ ${quantity} قطع` : 'السعر النهائي المحسوب'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#AD647D]">{totalPrice}</span>
                  <span className="text-xs font-bold text-[#AD647D]">ر.س</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={liveProduct.stock === 0}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-95 cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : liveProduct.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#E7A0B4] via-[#AD647D] to-[#8C465F] hover:brightness-105 text-white'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>تمت الإضافة للسلة بنجاح! 🌸</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{liveProduct.stock === 0 ? 'نفدت الكمية حالياً' : 'إضافة إلى السلة'}</span>
                  </>
                )}
              </button>

              {addedSuccess && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-[#C9A46A] hover:bg-[#B38F56] text-white font-bold text-xs sm:text-sm transition shadow-md cursor-pointer animate-fadeIn shrink-0"
                >
                  عرض السلة
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
