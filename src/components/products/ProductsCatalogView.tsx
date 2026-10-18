import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Search, 
  Flower2, 
  Sparkles, 
  SlidersHorizontal,
  X,
  RotateCcw,
  Gift
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product, FlowerType } from '../../types';
import { STORE_OCCASIONS } from '../../lib/initialData';

interface ProductsCatalogViewProps {
  initialCategory?: string;
  onOpenProductDetails: (product: Product) => void;
}

export const ProductsCatalogView: React.FC<ProductsCatalogViewProps> = ({
  initialCategory,
  onOpenProductDetails
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedFlowerType, setSelectedFlowerType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [searchFilter, setSearchFilter] = useState('');

  // Update category when prop changes
  React.useEffect(() => {
    if (initialCategory) {
      if (initialCategory.startsWith('occ_')) {
        setSelectedOccasion(initialCategory.replace('occ_', ''));
        setSelectedCategory('all');
      } else {
        setSelectedCategory(initialCategory);
      }
    }
  }, [initialCategory]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      
      // Occasion filter
      const matchesOccasion = selectedOccasion === 'all' || (p.occasions && p.occasions.includes(selectedOccasion as any));

      // Flower Type filter
      const matchesFlowerType = selectedFlowerType === 'all' || p.flowerType === selectedFlowerType;

      // Text search
      const matchesSearch = !searchFilter.trim() ||
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(searchFilter.toLowerCase()));

      return matchesCategory && matchesOccasion && matchesFlowerType && matchesSearch;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedOccasion, selectedFlowerType, sortBy, searchFilter]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedFlowerType !== 'all' || searchFilter.trim() !== '';

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFlowerType('all');
    setSearchFilter('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fadeIn space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      
      {/* Page Title & Luxury Floral Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F8DDE6] text-[#AD647D] text-[11px] font-bold tracking-wider">
          <Sparkles className="w-3 h-3 text-[#C9A46A]" />
          <span>مجموعات Flora Faten الملكية بمكة المكرمة</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#2D141E] font-serif-lux leading-tight">
          كافة باقات الورد والهدايا والتنسيقات
        </h1>
        <p className="text-xs sm:text-sm text-[#5D2B3D]/80 leading-relaxed">
          تشكيلات حصرية من الورود الطبيعية الهولندية قطف يومي، والتنسيقات الصناعية الفاخرة، وبوكسات الهدايا وبالونات الهيليوم.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#F8DDE6] shadow-[0_4px_24px_-4px_rgba(173,100,125,0.06)] space-y-4">
        
        {/* Top search & sorting row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="ابحث باسم الباقة، نوع الورد، أو المناسبة..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl sm:rounded-2xl py-2.5 pr-9 pl-9 text-xs focus:outline-hidden focus:border-[#AD647D] transition shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#AD647D] absolute right-3 top-3 pointer-events-none" />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute left-3 top-2.5 p-1 text-gray-400 hover:text-[#AD647D] transition cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <span className="text-xs text-[#5D2B3D]/70 font-bold whitespace-nowrap">
              النتائج ({filteredProducts.length})
            </span>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl px-2.5 py-1.5 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#AD647D] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[#2D141E] focus:outline-hidden cursor-pointer"
                aria-label="ترتيب المنتجات"
              >
                <option value="featured">المميز والأكثر طلباً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar scroll-smooth w-full max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`py-2 px-3.5 sm:px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#AD647D] to-[#8C465F] text-white shadow-xs scale-102'
                : 'bg-[#FFF9FA] text-[#4A2030] hover:bg-pink-100/60 border border-[#F8DDE6]'
            }`}
          >
            كافة المنتجات ({products.length})
          </button>

          {categories.map((c) => {
            const count = products.filter(p => p.category === c.slug).length;
            const isSelected = selectedCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`py-2 px-3.5 sm:px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#AD647D] to-[#8C465F] text-white shadow-xs scale-102'
                    : 'bg-[#FFF9FA] text-[#4A2030] hover:bg-pink-100/60 border border-[#F8DDE6]'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-pink-100/60 text-[#AD647D]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Occasions Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth w-full max-w-full">
          <span className="text-[11px] font-bold text-[#C9A46A] flex items-center gap-1 shrink-0 px-1">
            <Gift className="w-3 h-3" />
            <span>المناسبة:</span>
          </span>

          <button
            onClick={() => setSelectedOccasion('all')}
            className={`py-1.5 px-3 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedOccasion === 'all'
                ? 'bg-[#C9A46A] text-white shadow-2xs'
                : 'bg-[#FFF9FA] text-[#4A2030] hover:bg-amber-50 border border-[#F8DDE6]'
            }`}
          >
            كافة المناسبات
          </button>

          {STORE_OCCASIONS.map((occ) => {
            const count = products.filter(p => p.occasions && p.occasions.includes(occ.id)).length;
            const isSelected = selectedOccasion === occ.id;

            return (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(isSelected ? 'all' : occ.id)}
                className={`py-1.5 px-3 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#AD647D] text-white shadow-2xs'
                    : 'bg-[#FFF9FA] text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
                }`}
              >
                <span>{occ.emoji}</span>
                <span>{occ.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 text-[#AD647D]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Flower Type Switcher & Active Filter status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pink-50 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#5D2B3D]/70 font-bold text-[11px]">نوع الزهور:</span>
            
            <div className="inline-flex p-0.5 rounded-xl bg-[#FFF9FA] border border-[#F8DDE6]">
              <button
                onClick={() => setSelectedFlowerType('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedFlowerType === 'all' 
                    ? 'bg-[#AD647D] text-white shadow-2xs' 
                    : 'text-gray-600 hover:text-[#AD647D]'
                }`}
              >
                الكل
              </button>

              <button
                onClick={() => setSelectedFlowerType('natural')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedFlowerType === 'natural' 
                    ? 'bg-[#AD647D] text-white shadow-2xs' 
                    : 'text-gray-600 hover:text-[#AD647D]'
                }`}
              >
                🌸 طبيعي هولندي
              </button>

              <button
                onClick={() => setSelectedFlowerType('artificial')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedFlowerType === 'artificial' 
                    ? 'bg-[#AD647D] text-white shadow-2xs' 
                    : 'text-gray-600 hover:text-[#AD647D]'
                }`}
              >
                ✨ صناعي فاخر دائم
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[11px] font-bold text-[#AD647D] hover:text-[#8C465F] flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>

      </div>

      {/* Products Grid: 2 columns on mobile, 2 on sm, 3 on md, 4 on lg */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F8DDE6] p-10 sm:p-14 text-center text-gray-500 space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto">
            <Flower2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#2D141E]">لا توجد باقات مطابقة لهذا البحث</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            لم نجد نتائج مطابقة لاختياراتك الحالية. يمكنك تعديل كلمات البحث أو تصفح باقي تصنيفات المتجر.
          </p>
          <button
            onClick={resetAllFilters}
            className="py-2.5 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            عرض كافة الباقات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
