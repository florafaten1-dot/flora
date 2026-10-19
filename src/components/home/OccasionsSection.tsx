import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Gift, 
  Heart, 
  Check, 
  Flame,
  Star 
} from 'lucide-react';
import { STORE_OCCASIONS } from '../../lib/initialData';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { OccasionType, Product } from '../../types';

interface OccasionsSectionProps {
  onNavigate: (tab: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const OccasionsSection: React.FC<OccasionsSectionProps> = ({
  onNavigate,
  onOpenProductDetails
}) => {
  const { products } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('celebrations');

  const activeOccasionInfo = STORE_OCCASIONS.find(o => o.id === selectedOccasion) || STORE_OCCASIONS[0];

  // Real products associated with selected occasion
  const occasionProducts = products.filter(p => 
    p.occasions && p.occasions.includes(selectedOccasion)
  );

  // If none explicitly tagged (should not happen with our catalog), fallback to real store products
  const displayProducts = occasionProducts.length > 0 
    ? occasionProducts 
    : products.filter(p => p.category === 'occasions-gifts').slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F8DDE6] text-[#AD647D] text-xs font-bold mb-2">
            <Gift className="w-3.5 h-3.5 text-[#C9A46A]" />
            <span>تنسيقات مخصصة لكل لحظة سعيدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
            الهدايا والزهور حسب المناسبة
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            اختر المناسبة واستكشف باقات الجوري، الشوكولاتة البلجيكية، والبالونات المنسقة بعناية لتعبر عن مشاعرك بصدق.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('products')}
          className="text-xs font-bold text-[#AD647D] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>عرض كافة هدايا المناسبات</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Occasions Pills / Tabs */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth w-full max-w-full">
        {STORE_OCCASIONS.map((occ) => {
          const isSelected = selectedOccasion === occ.id;
          const count = products.filter(p => p.occasions && p.occasions.includes(occ.id)).length;

          return (
            <button
              key={occ.id}
              type="button"
              onClick={() => setSelectedOccasion(occ.id)}
              className={`py-2 px-3.5 sm:px-4.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-gradient-to-r from-[#AD647D] via-[#944D66] to-[#8C465F] text-white shadow-md scale-102 border-transparent'
                  : 'bg-white hover:bg-[#FFF5F7] text-[#4A2030] border border-[#F8DDE6]'
              }`}
            >
              <span className="text-sm">{occ.emoji}</span>
              <span>{occ.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-pink-100/70 text-[#AD647D]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Occasion Spotlight Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FFF9FA] to-[#FFF0F4] border border-[#F8DDE6] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0 text-center sm:text-right">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#AD647D] flex items-center justify-center text-2xl shadow-sm border border-[#F8DDE6] shrink-0">
            {activeOccasionInfo.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-base font-black text-[#2D141E] font-serif-lux">
                {activeOccasionInfo.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#AD647D] text-white">
                {activeOccasionInfo.badge}
              </span>
            </div>
            <p className="text-xs text-[#5D2B3D]/80 mt-0.5">
              {activeOccasionInfo.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('products')}
          className="shrink-0 py-2.5 px-5 rounded-xl bg-white border border-[#F8DDE6] hover:border-[#AD647D] text-[#AD647D] hover:bg-[#AD647D] hover:text-white text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>تصفح كامل القسم في المتجر</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Occasion Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {displayProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onOpenDetails={onOpenProductDetails}
          />
        ))}
      </div>
    </section>
  );
};
