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
  Database 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-gradient-to-b from-[#FFF9FA] to-[#FFF0F4] border-t border-[#F8DDE6] text-[#4A2030] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#F8DDE6]">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#AD647D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D141E]">توصيل واستلام خلال 2 - 5 أيام</h4>
              <p className="text-[11px] text-[#AD647D]/80">تجهيز فاخر ودقيق داخل مكة المكرمة وضواحيها</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <Flower2 className="w-6 h-6 text-[#AD647D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D141E]">ورود طبيعية قطف يومي</h4>
              <p className="text-[11px] text-[#AD647D]/80">أجود أنواع الزهور الهولندية الفاخرة</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-[#AD647D]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D141E]">كرت إهداء مجاني</h4>
              <p className="text-[11px] text-[#AD647D]/80">مع طباعة فاخرة بختم شمعي مميز</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#F8DDE6]/80 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F8DDE6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#C9A46A]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D141E]">الدفع عند الاستلام فقط</h4>
              <p className="text-[11px] text-[#AD647D]/80">نقدًا أو شبكة (مدى) مع المندوب عند الاستلام</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
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

            {/* Cloud Central Sync badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>مزامنة سحابية حية عبر Firebase Firestore</span>
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
                  برنامج التسويق بالعمولة (شركاء النجاح)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy')} className="hover:text-[#AD647D] transition">
                  الشروط وسياسة الاسترجاع
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#AD647D] border-r-2 border-[#C9A46A] pr-2">
              خدمة العملاء
            </h5>
            <ul className="space-y-2.5 text-xs">
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
        <div className="pt-8 border-t border-[#F8DDE6] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#AD647D]">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} متجر Flora Faten | فلورا فاتن
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-gray-500">طرق الدفع المتاحة:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-white rounded-md border border-[#F8DDE6] text-[10px] font-bold text-blue-900 shadow-2xs">
                مدى Mada
              </span>
              <span className="px-2 py-1 bg-black text-white rounded-md text-[10px] font-bold shadow-2xs">
                 Pay
              </span>
              <span className="px-2 py-1 bg-white rounded-md border border-[#F8DDE6] text-[10px] font-bold text-blue-600 shadow-2xs">
                Visa / Master
              </span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold shadow-2xs">
                الدفع عند الاستلام
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
