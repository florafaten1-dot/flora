import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
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
  const { wishlist, products } = useStore();

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>قائمة الرغبات والمفضلة ({favoriteProducts.length})</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          الباقات والهدايا المفضلة لديك
        </h1>
        <p className="text-xs text-gray-500">
          الباقات التي نالت إعجابك لحفظها وطلبها في الوقت المناسب.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F8DDE6] p-12 text-center text-gray-500 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-[#2D141E]">قائمتك المفضلة فارغة حالياً</h3>
          <p className="text-xs text-gray-400">
            انقر على رمز القلب في أي باقة لإضافتها إلى قائمة مفضلتك والرجوع إليها لاحقاً.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="py-2.5 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold rounded-xl transition"
          >
            تصفح المتجر الآن
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
