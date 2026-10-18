import React, { useState } from 'react';
import { 
  Flower2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  Check, 
  Heart, 
  Truck, 
  FileText 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 sm:space-y-12 overflow-hidden">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] border-2 border-[#C9A46A] flex items-center justify-center mx-auto shadow-md">
          <Flower2 className="w-8 h-8 text-[#AD647D]" />
        </div>
        <span className="text-xs font-bold text-[#C9A46A] tracking-widest uppercase">قصة علامتنا</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2D141E] font-serif-lux">
          من نحن | Flora Faten
        </h1>
        <p className="text-sm text-[#5D2B3D]/80 max-w-xl mx-auto leading-relaxed">
          حيث يلتقي سحر الطبيعة مع فخامة التنسيق الملكي باللون الوردي والأبيض
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-8 shadow-xs space-y-6 text-sm text-[#4A2030] leading-relaxed">
        <h2 className="text-xl font-bold font-serif-lux text-[#AD647D]">
          تأسست لتصنع لحظات لا تُنسى
        </h2>
        <p>
          انطلقت <strong>Flora Faten (فلورا فاتن)</strong> من شغف عميق بلغة الزهور، وإيمان بأن كل باقة ورد هي رسالة حب وتقدير وامتنان تحمل أصدق المشاعر الإنسانية. اخترنا هويتنا الوردية والبيضاء مع لمسات الذهب لنعكس الرقة والصفاء والأناقة الملكية التي تليق بمناسباتكم السعيدة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] text-center space-y-2">
            <span className="text-2xl">🇳🇱</span>
            <h4 className="font-bold text-xs text-[#2D141E]">ورود هولندية طازجة</h4>
            <p className="text-[11px] text-gray-500">استيراد جوي مباشر وقطف يومي لأطول عمر وازدهار للزهرة.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] text-center space-y-2">
            <span className="text-2xl">✨</span>
            <h4 className="font-bold text-xs text-[#2D141E]">زهور صناعية وحريرية</h4>
            <p className="text-[11px] text-gray-500">تنسيقات حريرية فائقة الدقة تحاكي الطبيعي وتدوم لسنوات.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] text-center space-y-2">
            <span className="text-2xl">💌</span>
            <h4 className="font-bold text-xs text-[#2D141E]">أناقة كروت الإهداء</h4>
            <p className="text-[11px] text-gray-500">طباعة فاخرة بختم شمعي مميز وعبارات مصممة من القلب.</p>
          </div>
        </div>

        <h3 className="text-base font-bold text-[#AD647D] pt-4">رؤيتنا ورسالتنا بمكة المكرمة</h3>
        <p>
          أن نكون الوجهة الأولى والمفضلة في مكة المكرمة لهدايا الزهور وتنسيقات المناسبات السعيدة، بتقديم تجربة تسوق رقمية فاخرة وسلسة مدعومة بأحدث التقنيات وخدمات التجهيز والتوصيل المجدول خلال من يومين إلى 5 أيام بدقة متناهية لجميع أحياء وضواحي مكة المكرمة.
        </p>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { settings } = useStore();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          اتصل بنا | تواصل مع فلورا فاتن
        </h1>
        <p className="text-xs text-gray-500">
          فريق خدمة العملاء متواجد لمساعدتك والإجابة على كافة استفساراتك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info */}
        <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-6 shadow-xs">
          <h3 className="font-bold text-base text-[#AD647D]">معلومات التواصل المباشر</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9FA]">
              <Phone className="w-5 h-5 text-[#AD647D]" />
              <div>
                <span className="text-gray-400 block text-[10px]">الهاتف / الجوال:</span>
                <span className="font-bold font-mono text-sm" dir="ltr">{settings.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9FA]">
              <Mail className="w-5 h-5 text-[#AD647D]" />
              <div>
                <span className="text-gray-400 block text-[10px]">البريد الإلكتروني:</span>
                <span className="font-bold">{settings.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF9FA]">
              <MapPin className="w-5 h-5 text-[#AD647D] shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 block text-[10px]">المقر الرئيسي:</span>
                <span className="font-bold leading-relaxed">{settings.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 text-emerald-800">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="block text-[10px]">ساعات العمل:</span>
                <span className="font-bold">يوميًا من 9:00 صباحاً حتى 11:30 مساءً</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>محادثة واتساب فورية</span>
          </a>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 shadow-xs">
          <h3 className="font-bold text-base text-[#AD647D] mb-4">أرسل لنا رسالة</h3>
          
          {sent ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl text-emerald-800">
              <Check className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">تم استلام رسالتك بنجاح!</h4>
              <p className="text-xs">سيتواصل معك أحد منسقينا في أقرب وقت.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-gray-700">الاسم الكريم</label>
                <input
                  type="text"
                  required
                  placeholder="اسمك"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5 focus:border-[#E7A0B4]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-gray-700">رقم الجوال</label>
                <input
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5 text-right focus:border-[#E7A0B4]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-gray-700">نص الرسالة أو الاستفسار</label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب تفاصيل طلبك أو استفسارك..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5 focus:border-[#E7A0B4] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#AD647D] hover:bg-[#8C465F] text-white font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export const PolicyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          الشروط والأحكام وسياسة الاسترجاع والتوصيل
        </h1>
        <p className="text-xs text-gray-500">
          تتوافق سياسات متجر Flora Faten مع أنظمة التجارة الإلكترونية في المملكة العربية السعودية
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-8 shadow-xs space-y-6 text-xs text-[#4A2030] leading-relaxed">
        
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <Truck className="w-4 h-4" /> 1. سياسة التوصيل والشحن (مكة المكرمة فقط)
          </h3>
          <p>
            • تقتصر خدمات التوصيل حالياً على جميع أحياء وضواحي مكة المكرمة حصرياً.
          </p>
          <p>
            • يتم توصيل واستلام جميع الطلبات مجدولاً خلال من يومين إلى 5 أيام لضمان جودة قطف وتنسيق الزهور الملكية الطازجة.
          </p>
          <p>
            • طريقة الدفع المعتمدة لجميع الطلبات هي الدفع عند الاستلام فقط (نقدًا أو عبر جهاز مدى لنقاط البيع مع المندوب عند استلام طلبك وفحصه).
          </p>
          <p>
            • يلتزم المندوب بالتواصل مع المستلم لتحديد الموقع الدقيق وموعد التسليم المناسب، ما لم يختر العميل خيار "مفاجأة المستلم".
          </p>
          <p>
            • التوصيل مجاني لجميع الطلبات التي تتجاوز قيمتها 300 ريال سعودي داخل مكة المكرمة.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <Flower2 className="w-4 h-4" /> 2. طبيعة المنتجات والاسترجاع
          </h3>
          <p>
            • نظرًا لكون الورود الطبيعية والشوكولاتة منتجات استهلاكية سريعة التلف يتم تجهيزها وقصها خصيصًا لكل طلب، فإنه لا يمكن استرجاعها بعد التجهيز أو التسليم إلا في حال وجود عيب في جودة الزهور أو اختلاف تام عن الطلب.
          </p>
          <p>
            • يضمن متجر Flora Faten نضارة الورود الطبيعية بنسبة 100% وقت التسليم.
          </p>
          <p>
            • يمكن استرجاع أو استبدال الورود الصناعية والإكسسوارات غير القابلة للتلف خلال 3 أيام من تاريخ الاستلام بشرط أن تكون بحالتها الأصلية.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 3. الخصوصية وأمان البيانات
          </h3>
          <p>
            • نلتزم بحماية سرية وخصوصية بيانات عملائنا والمستلمين، ولا يتم مشاركة أي معلومات مع أي طرف ثالث سوى مناديب التوصيل المعتمدين لغرض تسليم الشحنة فقط.
          </p>
          <p>
            • جميع العمليات المالية تتم عبر بوابات دفع آمنة ومشفرة تمامًا.
          </p>
        </section>

      </div>
    </div>
  );
};
