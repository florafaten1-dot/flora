import React from 'react';
import { 
  Flower2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Heart, 
  CheckCircle2, 
  Database,
  Sparkles 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-gradient-to-b from-[#FFF9FA] to-[#FFF0F4] border-t border-[#F8DDE6] text-[#4A2030] pt-12 sm:pt-16 pb-12 mt-16 sm:mt-20 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Value Badges - responsive 1 col mobile, 2 sm, 4 lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pb-8 sm:pb-12 border-b border-[#F8DDE6]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#AD647D]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#2D141E] truncate">توصيل واستلام خلال 2 - 5 أيام</h4>
              <p className="text-[10px] sm:text-[11px] text-[#AD647D]/80 leading-relaxed">تجهيز فاخر ودقيق داخل مكة وضواحيها</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#AD647D]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#2D141E] truncate">ورود طبيعية قطف يومي</h4>
              <p className="text-[10px] sm:text-[11px] text-[#AD647D]/80 leading-relaxed">أجود أنواع الزهور الهولندية الفاخرة</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#AD647D]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#2D141E] truncate">كرت إهداء مجاني</h4>
              <p className="text-[10px] sm:text-[11px] text-[#AD647D]/80 leading-relaxed">مع طباعة فاخرة بختم شمعي مميز</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A46A]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#2D141E] truncate">الدفع عند الاستلام فقط</h4>
              <p className="text-[10px] sm:text-[11px] text-[#AD647D]/80 leading-relaxed">نقدًا أو شبكة (مدى) مع المندوب</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 py-8 sm:py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="cursor-pointer group select-none inline-block"
            >
              <BrandLogo textSize="lg" imageClassName="w-10 h-10" />
            </div>
            
            <p className="text-xs text-[#5D2B3D] leading-relaxed max-w-sm">
              {settings.tagline || 'حيث تتفتح مشاعرك بأرقى باقات الورد والهدايا الفاخرة وتنسيقات المناسبات السعيدة في المملكة العربية السعودية.'}
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#AD647D] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A46A]" />
              <span>صناعة يدوية فاخرة | توصيل حصري بمكة المكرمة</span>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              <span>الرقم الضريبي: {settings.taxNumber}</span>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#AD647D] border-r-2 border-[#C9A46A] pr-2">
              التصنيفات
            </h5>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button 
                    onClick={() => onNavigate(`cat_${c.slug}`)}
                    className="hover:text-[#AD647D] hover:underline transition"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#AD647D] border-r-2 border-[#C9A46A] pr-2">
              روابط المتجر
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#AD647D] transition">
                  الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#AD647D] transition">
                  جميع الباقات والهدايا
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-[#AD647D] transition">
                  تتبع حالة الطلب
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#AD647D] transition">
                  الأسئلة الشائعة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#AD647D] transition">
                  من نحن - قصة فلورا فاتن
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#AD647D] transition">
                  اتصل بنا
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliate')} className="hover:text-[#AD647D] transition font-semibold text-[#AD647D]">
                  برنامج شركاء النجاح (التسويق بالعمولة)
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Contact Details */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#AD647D] border-r-2 border-[#C9A46A] pr-2">
              السياسات وخدمة العملاء
            </h5>
            <ul className="space-y-2 text-xs mb-3">
              <li>
                <button onClick={() => onNavigate('delivery-policy')} className="hover:text-[#AD647D] transition">
                  سياسة التوصيل والاسترجاع
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#AD647D] transition">
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#AD647D] transition">
                  الشروط والأحكام
                </button>
              </li>
            </ul>

            <ul className="space-y-2.5 text-xs pt-2 border-t border-[#F8DDE6]/50">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#AD647D]" />
                <span dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#AD647D]" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#AD647D] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-700 font-semibold pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>يوميًا من 9:00 ص حتى 11:30 م</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Payment Icons */}
        <div className="pt-8 border-t border-[#F8DDE6] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#AD647D] text-center md:text-right">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} متجر Flora Faten | فلورا فاتن — مكة المكرمة
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-[11px] font-medium text-gray-500">طريقة الدفع عند الاستلام:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-1 bg-white rounded-md border border-[#F8DDE6] text-[10px] font-bold text-blue-900 shadow-2xs">
                مدى Mada (جهاز نقاط البيع)
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold shadow-2xs">
                نقداً مع المندوب
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
