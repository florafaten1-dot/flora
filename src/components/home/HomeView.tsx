import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Heart, 
  Flower2, 
  Star, 
  Truck, 
  ShieldCheck, 
  Gift, 
  Clock, 
  Phone 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenProductDetails
}) => {
  const { products, categories, settings } = useStore();

  const featuredProducts = products.filter(p => p.featured || p.isBestSeller).slice(0, 8);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 animate-fadeIn w-full max-w-full overflow-hidden">
      
      {/* LUXURY HERO BANNER */}
      <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-white pt-6 pb-12 sm:pt-8 sm:pb-16 md:py-20 border-b border-[#F8DDE6]">
        {/* Soft Background Decorative Blobs without negative margin leaks */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#F8DDE6]/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#E7A0B4]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left/Right Text Content (RTL) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-right min-w-0">
              
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#E7A0B4] shadow-xs text-[11px] sm:text-xs font-bold text-[#AD647D] max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A46A] shrink-0" />
                <span className="truncate">بوتيك الزهور والهدايا الفاخرة باللون الوردي والأبيض</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-[#2D141E] leading-tight font-serif-lux">
                أبهج من تحب بأرقى <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AD647D] via-[#E7A0B4] to-[#C9A46A]">
                  باقات الورد والهدايا
                </span>
              </h1>

              <p className="text-xs sm:text-base text-[#5D2B3D]/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                في <strong className="text-[#AD647D]">Flora Faten</strong> نصمم مشاعرك بعناية فائقة بمكة المكرمة. ورود هولندية طبيعية قطف يومي، ورود صناعية دائمة تدوم طويلاً، بوكسات جلدية فاخرة، وتوزيعات بالونات وشوكولاتة بلجيكية مع توصيل واستلام مجدول خلال من يومين إلى 5 أيام لجميع أحياء مكة المكرمة، والدفع عند الاستلام فقط.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('products')}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-gradient-to-r from-[#E7A0B4] via-[#AD647D] to-[#AD647D] text-white font-bold text-sm shadow-md hover:shadow-xl hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>تسوق الباقات الفاخرة</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('cat_pink-white-bouquets')}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white border border-[#E7A0B4] hover:bg-[#FFF0F4] text-[#AD647D] font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flower2 className="w-4 h-4 text-[#C9A46A]" />
                  <span>مجموعة الوردي والأبيض</span>
                </button>
              </div>

              {/* Mini Guarantees - responsive 1 col mobile, 3 cols sm+ */}
              <div className="pt-5 sm:pt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 border-t border-[#F8DDE6]/80 text-[11px] sm:text-xs text-[#4A2030] font-semibold">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 p-1.5 sm:p-0 rounded-xl bg-white/40 sm:bg-transparent">
                  <Truck className="w-4 h-4 text-[#AD647D] shrink-0" />
                  <span>توصيل واستلام خلال 2 - 5 أيام</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 p-1.5 sm:p-0 rounded-xl bg-white/40 sm:bg-transparent">
                  <Gift className="w-4 h-4 text-[#C9A46A] shrink-0" />
                  <span>كرت إهداء مجاني فاخر</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 p-1.5 sm:p-0 rounded-xl bg-white/40 sm:bg-transparent">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ضمان نضارة الزهور 100%</span>
                </div>
              </div>

            </div>

            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 relative w-full min-w-0">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Main Hero Image */}
                <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-[#F8DDE6] relative">
                  <img
                    src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=85"
                    alt="باقة فلورا فاتن الوردية"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Overlay Card 1 */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#F8DDE6] shadow-lg flex items-center gap-2 sm:gap-2.5 max-w-[85%]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFF0F4] flex items-center justify-center shrink-0">
                      <Flower2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#AD647D]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 block">قطف يومي</span>
                      <span className="text-[11px] sm:text-xs font-black text-[#2D141E] truncate block">جوري وبيوني ملكي</span>
                    </div>
                  </div>

                  {/* Floating Overlay Card 2 */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#F8DDE6] shadow-lg flex items-center gap-2 sm:gap-2.5 max-w-[85%]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A46A] fill-[#C9A46A]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 block">تقييم العملاء</span>
                      <span className="text-[10px] sm:text-xs font-black text-[#AD647D] truncate block">4.9 / 5 (أكثر من 1500 عميل)</span>
                    </div>
                  </div>
                </div>

                {/* Golden Badge Accent safely positioned */}
                <div className="absolute bottom-1 right-1 sm:-bottom-3 sm:-right-3 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#C9A46A] to-[#E5CCA0] text-white p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-lg border-2 border-white font-serif-lux text-[10px] sm:text-xs font-bold pointer-events-none">
                  <span>Flora</span>
                  <span className="text-[8px] sm:text-[10px]">Faten</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-[#C9A46A] uppercase tracking-wider">تشكيلاتنا الحصرية</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux mt-1">
              تسوق حسب تصنيفات الورود والهدايا
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[#AD647D] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>عرض كافة التصنيفات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`cat_${cat.slug}`)}
              className="group bg-white rounded-3xl border border-[#F8DDE6] hover:border-[#E7A0B4] p-3 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center overflow-hidden"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-[#FFF9FA]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#2D141E] group-hover:text-[#AD647D] transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#C9A46A] uppercase tracking-wider">مختارات فلورا فاتن</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux mt-1">
              الباقات الأكثر طلباً ومحبة 🌸
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[#AD647D] hover:underline flex items-center gap-1"
          >
            <span>المزيد من الباقات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetails}
            />
          ))}
        </div>
      </section>

      {/* OCCASIONS SPECIAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2D141E] via-[#4A2030] to-[#2D141E] text-white p-8 md:p-14 shadow-2xl border border-[#F8DDE6]/20">
          
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-[#C9A46A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              تنسيقات المناسبات الكبرى
            </span>

            <h3 className="text-2xl sm:text-4xl font-black font-serif-lux leading-tight">
              احتفل بأجمل اللحظات: <br />
              تخرج، زفاف، ومواليد جدد 🎓💍👶
            </h3>

            <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
              نوفر تنسيقات متكاملة تشمل الأستاندات الفاخرة، بالونات الهيليوم المخصصة بالاسم، قوالب الشوكولاتة البلجيكية، وكروت الإهداء الشمعية لتكون هديتك الأجمل في كل مناسبة.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('cat_occasions-gifts')}
                className="py-3 px-6 rounded-full bg-[#E7A0B4] hover:bg-[#AD647D] text-white font-bold text-xs transition shadow-md"
              >
                تصفح هدايا المناسبات
              </button>

              <button
                onClick={() => onNavigate('cat_balloons-party')}
                className="py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs transition"
              >
                بالونات وتوزيعات
              </button>
            </div>
          </div>

          {/* Decorative floral watermark on the right */}
          <div className="hidden lg:block absolute -left-12 -bottom-12 w-80 h-80 opacity-20 pointer-events-none">
            <Flower2 className="w-full h-full text-white" />
          </div>

        </div>
      </section>

      {/* WHATSAPP CUSTOM CONCIERGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#FFF4F7] border border-[#F8DDE6] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#2D141E]">
                هل ترغب بتنسيق باقة خاصة أو كميات للمناسبات؟
              </h4>
              <p className="text-xs text-[#5D2B3D]/80 mt-1">
                تحدث مباشرة مع منسقي الزهور في بوتيك فلورا فاتن وسنصنع لك طلباً مخصصاً بالكامل.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً فلورا فاتن، أود الاستفسار عن تنسيق باقة مخصصة')}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition whitespace-nowrap flex items-center gap-2"
          >
            <span>محادثة واتساب مباشرة</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
