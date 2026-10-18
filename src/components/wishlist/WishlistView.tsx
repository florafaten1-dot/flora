import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Trash2, 
  CloudCheck, 
  Sparkles, 
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface WishlistViewProps {
  onNavigate: (tab: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  onNavigate,
  onOpenProductDetails
}) => {
  const { wishlist, products, currentUser, clearWishlist, loadingData } = useStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  const handleClearAll = async () => {
    try {
      setClearing(true);
      await clearWishlist();
      setShowClearConfirm(false);
    } catch (e) {
      console.error('Error clearing wishlist', e);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fadeIn space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200 shadow-2xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>قائمة الرغبات والمفضلة ({favoriteProducts.length})</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#2D141E] font-serif-lux leading-tight">
          الباقات والهدايا المفضلة لديك
        </h1>
        <p className="text-xs sm:text-sm text-[#5D2B3D]/70 leading-relaxed">
          الباقات والتنسيقات التي نالت إعجابك لحفظها ومقارنتها وطلبها في الوقت المناسب.
        </p>

        {/* Sync Status Badge */}
        <div className="pt-1 flex items-center justify-center">
          {currentUser ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>مزامنة سحابية نشطة مع حسابك ({currentUser.email || currentUser.displayName || 'عميل مسجل'}) ☁️</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
              <span>محفوظة محلياً في متصفحك.</span>
              <button
                type="button"
                onClick={() => onNavigate('account')}
                className="font-bold underline text-[#AD647D] hover:text-[#8C465F] cursor-pointer flex items-center gap-0.5"
              >
                <span>سجّل دخولك لمزامنتها سحابياً</span>
                <LogIn className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar (When items exist) */}
      {favoriteProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#F8DDE6] shadow-2xs">
          <div className="text-xs font-bold text-[#2D141E] flex items-center gap-2">
            <span>إجمالي الباقات المحفوظة:</span>
            <span className="text-sm text-[#AD647D] font-black">{favoriteProducts.length} باقة</span>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFF9FA] hover:bg-[#FFF0F4] text-[#AD647D] border border-[#F8DDE6] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>تصفح المزيد</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {showClearConfirm ? (
              <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200 animate-fadeIn">
                <span className="text-[11px] text-red-700 font-bold px-1.5">هل أنت متأكد؟</span>
                <button
                  type="button"
                  disabled={clearing}
                  onClick={handleClearAll}
                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                >
                  {clearing ? 'جاري المسح...' : 'نعم، امسح'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded-lg bg-white text-gray-600 text-[11px] font-medium border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-[#F8DDE6] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="مسح كافة المنتجات من المفضلة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح المفضلة</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F8DDE6] p-8 sm:p-14 text-center text-gray-500 space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FFF0F4] to-pink-50 text-[#AD647D] flex items-center justify-center mx-auto border border-[#F8DDE6] shadow-inner">
            <Heart className="w-10 h-10 text-[#AD647D]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2D141E]">قائمتك المفضلة فارغة حالياً</h3>
            <p className="text-xs text-[#5D2B3D]/70 max-w-xs mx-auto leading-relaxed">
              انقر على رمز القلب في أي باقة ورد أو هدية لإضافتها إلى مفضلتك والرجوع إليها ومشاركتها مع أحبائك.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="py-3 px-8 bg-gradient-to-r from-[#AD647D] to-[#8C465F] hover:brightness-105 text-white text-xs font-bold rounded-2xl transition shadow-md cursor-pointer"
          >
            استكشف تشكيلات فلورا فاتن 🌸
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {favoriteProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpenDetails={onOpenProductDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
