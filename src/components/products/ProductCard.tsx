import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Flame, Scale } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { isInWishlist, toggleWishlist, isInCompare, addToCompare, removeFromCompare } = useStore();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentPrice = product.salePrice ?? product.price;

  return (
    <div 
      className="group bg-white rounded-2xl sm:rounded-3xl border border-[#F8DDE6]/90 hover:border-[#E7A0B4] shadow-[0_4px_20px_-4px_rgba(173,100,125,0.06)] hover:shadow-[0_14px_30px_-6px_rgba(173,100,125,0.18)] transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
    >
      {/* 1. Image Container with Refined Badges */}
      <div 
        onClick={() => onOpenDetails(product)}
        className="relative aspect-4/5 overflow-hidden bg-[#FFF9FA] cursor-pointer"
      >
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Soft Vignette / Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF5F8] via-[#FDF0F4] to-[#FCE6EE] p-4 text-center select-none group-hover:scale-102 transition-transform duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center mb-2 text-[#C9A46A] border border-pink-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#4A2030] line-clamp-1">{product.name}</span>
            <span className="text-[10px] text-[#AD647D] mt-1.5 font-medium bg-white/80 px-2 py-0.5 rounded-full border border-pink-100/80 shadow-2xs">
              بانتظار إضافة الصورة
            </span>
          </div>
        )}

        {/* Floating Badges - Top Right */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-col gap-1.5 z-10 items-end">
          {product.salePrice && (
            <span className="bg-[#A63A50] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-md tracking-tight flex items-center gap-0.5">
              <span>خصم {discountPercent}%</span>
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-[#C9A46A] to-[#DFBA80] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>الأكثر طلباً</span>
            </span>
          )}
          {product.isNew && !product.isBestSeller && (
            <span className="bg-[#4A2030] text-pink-100 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              جديد
            </span>
          )}
        </div>

        {/* Flower Type Luxury Tag - Top Left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
          <span className="bg-white/95 backdrop-blur-md text-[#AD647D] text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[#F8DDE6] shadow-xs">
            {product.flowerType === 'natural' 
              ? '🌸 طبيعي هولندي' 
              : product.flowerType === 'artificial'
              ? '✨ صناعي دائم'
              : '🌿 تشكيلة مختارة'}
          </span>
        </div>

        {/* Floating Action Buttons: Wishlist & Compare */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
              inWishlist
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-white/90 backdrop-blur-xs text-[#AD647D] hover:bg-white hover:text-rose-500 hover:scale-110'
            }`}
            title={inWishlist ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            aria-label="المفضلة"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (inCompare) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product.id);
              }
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
              inCompare
                ? 'bg-[#C9A46A] text-white scale-105'
                : 'bg-white/90 backdrop-blur-xs text-[#AD647D] hover:bg-white hover:text-[#C9A46A] hover:scale-110'
            }`}
            title={inCompare ? "مضاف لجدول المقارنة (اضغط للإزالة)" : "مقارنة هذه الباقة ⚖️"}
            aria-label="مقارنة المنتج"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Quick Customization Floating Button */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 pointer-events-none">
          <span className="bg-[#2D141E]/85 backdrop-blur-md hover:bg-[#2D141E] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#E7A0B4]" />
            <span>معاينة وتخصيص</span>
          </span>
        </div>
      </div>

      {/* 2. Content & Information Body */}
      <div className="p-3 sm:p-4.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#C9A46A] font-bold text-[10px] sm:text-[11px] tracking-wide">
              {product.categoryName || 'فلورا فاتن'}
            </span>
            <div className="flex items-center gap-1 bg-[#FFF9FA] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#F8DDE6]">
              <Star className="w-3 h-3 fill-[#C9A46A] text-[#C9A46A]" />
              <span className="font-extrabold text-[10px] sm:text-[11px] text-[#2D141E]">
                {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#5D2B3D]/60 font-medium">
                ({product.reviewsCount ?? 0})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="font-bold text-xs sm:text-sm text-[#2D141E] group-hover:text-[#AD647D] transition cursor-pointer line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-[10px] sm:text-[11px] text-[#5D2B3D]/70 mt-1 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Low Stock Indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
              <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
              <span>متبقي {product.stock} فقط في مكة</span>
            </div>
          )}
        </div>

        {/* 3. Price & Action Row */}
        <div className="pt-2 sm:pt-3 border-t border-[#F8DDE6]/70 flex items-center justify-between gap-2 mt-auto">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-[#AD647D] tracking-tight">
                {currentPrice}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#AD647D]">
                ر.س
              </span>

              {product.salePrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through mr-1">
                  {product.price}
                </span>
              )}
            </div>

            {product.sizes && product.sizes.length > 1 && (
              <span className="text-[9px] text-[#C9A46A] font-semibold">
                متوفر بعدة أحجام
              </span>
            )}
          </div>

          {/* Customization & Add CTA */}
          <button
            onClick={() => onOpenDetails(product)}
            className="bg-gradient-to-r from-[#FFF0F4] to-[#FFE8EF] hover:from-[#AD647D] hover:to-[#8C465F] text-[#AD647D] hover:text-white border border-[#F8DDE6] hover:border-transparent px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-2xs hover:shadow-md flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 shrink-0"
            aria-label={`تخصيص وطلب ${product.name}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تخصيص وإهداء</span>
            <span className="sm:hidden">طلب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
