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
  FileText,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Lock,
  RotateCcw
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
          حيث تلتقي حرفة صنع ورد الساتان الفاخر مع لمسات التنسيق الملكي باللون الوردي والأبيض
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 sm:p-8 shadow-xs space-y-6 text-sm text-[#4A2030] leading-relaxed">
        <h2 className="text-xl font-bold font-serif-lux text-[#AD647D]">
          تأسست لتصنع هدايا تدوم وذكريات تخلد
        </h2>
        <p>
          انطلقت <strong>Flora Faten (فلورا فاتن)</strong> من شغف عميق بفنون الورود اليدوية، وإيمان بأن كل باقة ورد هي رسالة حب وتقدير وامتنان تُحفر في الذاكرة. تخصصنا في صياغة <strong>بوكيهات ورد الساتان الفاخرة المصنوعة يدويًا بدقة متناهية</strong> بتدرجات الوردي الملكي، الأبيض العاجي، واللمسات الذهبية الأنيقة؛ لنقدم ورودًا لا تذبل أبدًا وتبقى تذكارًا ثمينًا لأجمل مناسباتكم.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] text-center space-y-2">
            <span className="text-2xl">✨</span>
            <h4 className="font-bold text-xs text-[#2D141E]">ورد ساتان يدوي فاخر</h4>
            <p className="text-[11px] text-gray-500">حياكة يدوية متقنة لكل بتلة تمنحك مظهرًا ملكيًا جذابًا لا يذبل أبدًا.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] text-center space-y-2">
            <span className="text-2xl">🚗</span>
            <h4 className="font-bold text-xs text-[#2D141E]">توصيل حصري داخل مكة</h4>
            <p className="text-[11px] text-gray-500">توصيل لباب بيتك بجميع أحياء مكة المكرمة خلال 2 إلى 5 أيام بحرص وعناية.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] text-center space-y-2">
            <span className="text-2xl">💌</span>
            <h4 className="font-bold text-xs text-[#2D141E]">كروت إهداء مع ختم شمعي</h4>
            <p className="text-[11px] text-gray-500">طباعة فاخرة بختم شمعي وتفاصيل إهداء سرية تليق بمشاعرك.</p>
          </div>
        </div>

        <h3 className="text-base font-bold text-[#AD647D] pt-4">رؤيتنا ورسالتنا بمكة المكرمة</h3>
        <p>
          أن نكون العلامة الأولى والمفضلة في مكة المكرمة لبوكيهات ورد الساتان اليدوية والهدايا التذكارية، بتقديم تجربة تسوق إلكترونية راقية وبسيطة، مع الالتزام التام بالدفع عند الاستلام بعد معاينة هديتك واستلامها بكل راحة وطمأنينة.
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
          فريق خدمة العملاء متواجد لمساعدتك والإجابة على استفساراتك وتنسيق طلباتك الخاصة بمكة المكرمة
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
                <span className="text-gray-400 block text-[10px]">المقر الرئيسي والتوصيل:</span>
                <span className="font-bold leading-relaxed">{settings.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 text-emerald-800">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="block text-[10px]">أوقات استقبال الطلبات والرد:</span>
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
            <span>محادثة واتساب فورية مباشرة</span>
          </a>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 shadow-xs">
          <h3 className="font-bold text-base text-[#AD647D] mb-4">أرسل لنا استفسارك أو طلبك المخصص</h3>
          
          {sent ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl text-emerald-800">
              <Check className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">تم استلام رسالتك بنجاح!</h4>
              <p className="text-xs">سيتواصل معك فريق فلورا فاتن في أقرب وقت.</p>
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
                <label className="block font-bold mb-1 text-gray-700">رقم الجوال (داخل مكة المكرمة)</label>
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
                <label className="block font-bold mb-1 text-gray-700">نص الرسالة أو فكرة التنسيق المطلوب</label>
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

export const FAQView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ما الذي يميّز بوكيهات ورد الساتان عن الورد الطبيعي؟',
      a: 'بوكيهات ورد الساتان من Flora Faten مصنوعة يدويًا بعناية فائقة من أجود أنواع أشرطة الساتان اللامعة والمخملية. ميزتها الكبرى أنها ورود تذكارية دائمة لا تذبل، لا تحتاج إلى ماء أو رعاية خاصة، وتحتفظ برونقها وجمالها لسنوات طويلة كذكرى حية لمناسبتك الاستثنائية.'
    },
    {
      q: 'ما هي مناطق التوصيل المتاحة لديكم؟',
      a: 'خدمة التوصيل متاحة حصرياً داخل أحياء وضواحي مكة المكرمة (مثل حي الحمراء، العوالي، الشوقية، بطحاء قريش، الشرائع، الزاهر، النوارية، والمنطقة المركزية). لا نقوم بالتوصيل خارج مكة المكرمة لضمان أعلى معايير الجودة والتسليم المباشر والمضمون.'
    },
    {
      q: 'كم يستغرق تجهيز وتوصيل الطلب؟',
      a: 'نظرًا لأن بوكيهات الساتان تُصنع يدويًا وتُنسق بحرفية لكل عميل على حدة، يتم التجهيز والتوصيل المجدول خلال من يومين إلى 5 أيام من تاريخ الطلب. يمكنك اختيار التاريخ والفترة الزمنية المناسبة لك عند صفحة إتمام الطلب.'
    },
    {
      q: 'ما هي طرق الدفع المعتمدة لدى متجر فلورا فاتن؟',
      a: 'طريقة الدفع المعتمدة حاليًا هي "الدفع عند الاستلام فقط" (Cash on Delivery). يتيح لك ذلك فحص الباقة ومعاينتها عند وصول المندوب لباب بيتك في مكة، ثم السداد نقدًا أو عبر جهاز مدى لنقاط البيع المتوفر مع المندوب.'
    },
    {
      q: 'هل يمكنني إرسال الباقة كهدية ومفاجأة لشخص آخر؟',
      a: 'نعم بالتأكيد! يمكنك اختيار خيار "إهداء لشخص آخر"، وتحديد اسم المستلم ورقمه وعنوانه في مكة، مع إمكانية كتابة رسالة كرت إهداء فاخرة مطبوعة بختم شمعي مميز. كما يمكنك اختيار ميزة "مفاجأة المستلم" لعدم إخباره بالتفاصيل قبل وصول المندوب.'
    },
    {
      q: 'كيف يمكنني تتبع حالة طلبي؟',
      a: 'بمجرد إتمام طلبك، ستحصل على رقم طلب خاص (مثل FF-2026-XXXX). يمكنك التوجه لصفحة "تتبع الطلب" في المتجر وإدخال رقم الطلب ورقم جوالك لمعرفة حالة الطلب وتحديثات التجهيز والتوصيل لحظة بلحظة.'
    },
    {
      q: 'ما هو الحد الأدنى للطلب ورسوم التوصيل؟',
      a: 'الحد الأدنى للطلب في المتجر هو 50 ريال سعودي. رسوم التوصيل تتراوح بين 15 إلى 25 ريال بحسب الحي في مكة المكرمة، ويكون التوصيل مجانيًا تمامًا للطلبات التي تتجاوز قيمتها 300 ريال سعودي.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 overflow-hidden">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] border-2 border-[#C9A46A] flex items-center justify-center mx-auto shadow-md">
          <HelpCircle className="w-8 h-8 text-[#AD647D]" />
        </div>
        <span className="text-xs font-bold text-[#C9A46A] tracking-widest uppercase">مركز المساعدة</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2D141E] font-serif-lux">
          الأسئلة الشائعة | Flora Faten
        </h1>
        <p className="text-sm text-[#5D2B3D]/80 max-w-xl mx-auto leading-relaxed">
          إجابات وافية وشاملة حول بوكيهات ورد الساتان، الشحن بمكة المكرمة، والدفع عند الاستلام
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-[#F8DDE6] overflow-hidden transition shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 hover:bg-[#FFF9FA] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-[#2D141E] leading-relaxed">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#AD647D] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5D2B3D] leading-relaxed border-t border-[#F8DDE6]/50 bg-[#FFFDFD]">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] border-2 border-[#C9A46A] flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8 text-[#AD647D]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          سياسة الخصوصية وأمان البيانات
        </h1>
        <p className="text-xs text-gray-500">
          حماية بياناتكم الشخصية هي أولويتنا القصوى وفق نظام حماية البيانات الشخصية بالمملكة العربية السعودية
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#4A2030] leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 1. البيانات التي نجمعها
          </h3>
          <p>
            نحن نلتزم بمبدأ الحد الأدنى لجمع البيانات، ولا نجمع إلا ما هو ضروري لتنفيذ طلبك وإيصال باقتك إلى عنوانك بمكة المكرمة:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
            <li>الاسم ورقم الجوال للتواصل وتنسيق التسليم.</li>
            <li>عنوان التوصيل (الحي والشارع في مكة المكرمة).</li>
            <li>بيانات المستلم وعبارة كرت الإهداء في حال اختيار إرسال الطلب كهدية.</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> 2. الغرض من استخدام البيانات
          </h3>
          <p>
            تُستخدم بياناتك حصريًا للأغراض التشغيلية التالية:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
            <li>حياكة وتجهيز باقة ورد الساتان والملحقات المطلوبة.</li>
            <li>تنسيق موعد وموقع التوصيل مع مندوب التوصيل المعتمد داخل مكة.</li>
            <li>إرسال إشعارات حالة الطلب عبر واتساب أو الرسائل النصية.</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 3. عدم مشاركة البيانات مع أطراف خارجية
          </h3>
          <p>
            نؤكد التزامنا الصارم بعدم بيع، تأجير، أو مشاركة بيانات عملائنا مع أي جهة إعلانية أو طرف ثالث غير ذي صلة. لا يتم تزويد مندوب التوصيل إلا بالاسم ورقم الهاتف والعنوان المطلوب لتسليم الشحنة فقط.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> 4. حقوقك القانونية
          </h3>
          <p>
            يحق لك في أي وقت مراجعة بياناتك، تصحيحها، أو طلب حذف سجلك لدينا بعد اكتمال تنفيذ طلبك وتسليمه، وذلك عبر التواصل المباشر مع خدمة عملائنا.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] border-2 border-[#C9A46A] flex items-center justify-center mx-auto shadow-md">
          <FileText className="w-8 h-8 text-[#AD647D]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          الشروط والأحكام
        </h1>
        <p className="text-xs text-gray-500">
          اتفاقية الاستخدام والطلب من متجر Flora Faten | فلورا فاتن
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#4A2030] leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-[#AD647D]">1. نطاق الخدمة ومنطقة التوصيل</h3>
          <p>
            يقدم متجر Flora Faten خدمات البيع والتوصيل المجدول لبوكيهات ورد الساتان اليدوية والهدايا حصريًا داخل حدود وأحياء <strong>مكة المكرمة</strong> فقط. لا نقبل ولا نقوم بتنفيذ أي طلبات ذات عناوين تقع خارج نطاق مكة المكرمة.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D]">2. طبيعة المنتجات المصنوعة يدويًا</h3>
          <p>
            جميع بوكيهات ورد الساتان تُصنع يدويًا باحترافية كاملة. ونظرًا للطبيعة الحرفية لكل قطعة، قد توجد فروقات دقيقة وطبيعية جداً في تنسيق الورود والشرائط مما يمنح كل باقة طابعها الفريد والمميز.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D]">3. الأسعار وسياسة الدفع</h3>
          <p>
            • جميع الأسعار المعروضة في المتجر بالريال السعودي (SAR) وتشمل ضريبة القيمة المضافة القانونية.
          </p>
          <p>
            • يتم تثبيت وحفظ سعر المنتج ورسوم التوصيل وقت إنشاء الطلب، ولا يتأثر الطلب بأي تعديل لاحق للأسعار.
          </p>
          <p>
            • طريقة الدفع الوحيدة المعتمدة هي "الدفع عند الاستلام" (كاش أو مدى مع المندوب).
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D]">4. إلغاء وتعديل الطلبات</h3>
          <p>
            يمكن للعميل طلب تعديل أو إلغاء الطلب خلال أول ساعتين من إرساله وقبل بدء فريق العمل في تفصيل وقص شرائط الساتان الخاصة بالباقة. بعد بدء التنفيذ الفعلي، يخضع الإلغاء لسياسة الاسترجاع الخاصة بالمنتجات المصنعة حسب الطلب.
          </p>
        </section>
      </div>
    </div>
  );
};

export const DeliveryReturnPolicyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] border-2 border-[#C9A46A] flex items-center justify-center mx-auto shadow-md">
          <Truck className="w-8 h-8 text-[#AD647D]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          سياسة التوصيل والاسترجاع والاستبدال
        </h1>
        <p className="text-xs text-gray-500">
          تتوافق سياسات متجر Flora Faten مع أنظمة وزارة التجارة والتجارة الإلكترونية في المملكة العربية السعودية
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#4A2030] leading-relaxed">
        
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <Truck className="w-4 h-4" /> 1. شروط ومواعيد التوصيل (مكة المكرمة فقط)
          </h3>
          <p>
            • تقتصر خدمات التوصيل حصريًا على أحياء مكة المكرمة (حي الحمراء، العوالي، الشوقية، الرصيفة، الزاهر، الشرائع، النوارية، وكافة الأحياء المتاحة في خيارات الشحن).
          </p>
          <p>
            • يتم تجهيز وتوصيل كافة الطلبات مجدولاً خلال من <strong>يومين إلى 5 أيام</strong> لضمان حياكة ورد الساتان يدويًا بأعلى مستويات الجودة والإتقان.
          </p>
          <p>
            • التوصيل مجاني بالكامل لأي طلب بقيمة 300 ريال سعودي أو أكثر داخل مكة المكرمة.
          </p>
          <p>
            • يتواصل مندوبنا قبل التوصيل للتأكد من تواجد المستلم في الوقت المحدد لضمان استلام سلس وآمن.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> 2. سياسة الاستبدال والاسترجاع
          </h3>
          <p>
            • <strong>المنتجات المصنعة يدويًا حسب الطلب:</strong> وفقًا لنظام التجارة الإلكترونية السعودي ولائحته التنفيذية (المادة 13)، لا يحق للمستهلك فسخ العقد أو استرجاع المنتج إذا كان مصنّعًا بناءً على طلب المستهلك أو وفقًا لمواصفات حددها (مثل بوكيهات ورد الساتان المخصصة وتوزيعات المناسبات المحفورة أو المطبوعة بأسماء محددة)، إلا في حال وجود عيب مصنعي أو خطأ صريح في التنسيق من قبل المتجر.
          </p>
          <p>
            • <strong>الإكسسوارات الجاهزة:</strong> يمكن استبدال أو استرجاع الفازات والإكسسوارات غير المخصصة خلال 3 أيام من تاريخ الاستلام بشرط أن تكون بحالتها الأصلية غير المستخدمة مع عبوتها الكاملة.
          </p>
          <p>
            • في حال حدوث أي تلف أثناء التوصيل أو وجود عيب مصنعي، يتكفل متجر Flora Faten باستبدال الباقة فورًا وبدون أي تكلفة إضافية على العميل.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-pink-50">
          <h3 className="font-bold text-sm text-[#AD647D] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 3. معاينة الطلب قبل السداد
          </h3>
          <p>
            اعتماد المتجر لطريقة "الدفع عند الاستلام فقط" يمنح عملائنا الثقة الكاملة لمعاينة شكل الباقة والتأكد من مطابقتها لكافة رغباتهم وتفاصيل طلبهم قبل دفع المبلغ للمندوب.
          </p>
        </section>

      </div>
    </div>
  );
};

// Legacy backward-compatibility wrapper
export const PolicyView: React.FC = () => {
  return <DeliveryReturnPolicyView />;
};
