import React, { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Percent, 
  Building2, 
  Send,
  Eye,
  FileText,
  BadgePercent,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AffiliateProfile, PayoutRequest } from '../../types';

interface AffiliatePortalViewProps {
  onNavigate: (tab: string) => void;
}

export const AffiliatePortalView: React.FC<AffiliatePortalViewProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    userProfile, 
    currentAffiliateProfile, 
    applyForAffiliate, 
    requestPayout, 
    payouts, 
    orders 
  } = useStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPromoText, setCopiedPromoText] = useState(false);

  // Application form state
  const [appName, setAppName] = useState(currentUser?.displayName || '');
  const [appPhone, setAppPhone] = useState(userProfile?.phone || '');
  const [appSocial, setAppSocial] = useState('');
  const [appBankName, setAppBankName] = useState('مصرف الراجحي');
  const [appAccountHolder, setAppAccountHolder] = useState(currentUser?.displayName || '');
  const [appIban, setAppIban] = useState('');
  const [appNotes, setAppNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccessMessage, setAppSuccessMessage] = useState<string | null>(null);
  const [appErrorMessage, setAppErrorMessage] = useState<string | null>(null);

  // Payout request modal state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutBank, setPayoutBank] = useState(currentAffiliateProfile?.bankName || 'مصرف الراجحي');
  const [payoutHolder, setPayoutHolder] = useState(currentAffiliateProfile?.accountHolder || currentAffiliateProfile?.name || '');
  const [payoutIban, setPayoutIban] = useState(currentAffiliateProfile?.iban || '');
  const [submittingPayout, setSubmittingPayout] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Referral URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://florafaten.com';
  const referralCode = currentAffiliateProfile?.referralCode || 'FLORA';
  const referralUrl = `${baseUrl}/?ref=${referralCode}`;

  // Copy helpers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const promoTemplate = `🌸 كود خصم خاص وحصري لمتجر فلورا فاتن | Flora Faten للورود والهدايا الفاخرة!
استخدم كود الخصم: ${referralCode}
واحصل على خصم ${currentAffiliateProfile?.customerDiscountPercent || 10}% فوري على باقات الورد والبالونات والتنسيقات الفاخرة في مكة المكرمة 🎁💐
تسوق الآن عبر الرابط: ${referralUrl}`;

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(promoTemplate);
    setCopiedPromoText(true);
    setTimeout(() => setCopiedPromoText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(promoTemplate);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Submit Application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppErrorMessage(null);
    if (!appName.trim() || !appPhone.trim() || !appSocial.trim()) {
      setAppErrorMessage('يرجى ملء جميع الحقول الإلزامية');
      return;
    }
    if (!agreeTerms) {
      setAppErrorMessage('يرجى الموافقة على شروط برنامج التسويق بالعمولة');
      return;
    }

    setSubmittingApp(true);
    try {
      await applyForAffiliate({
        name: appName.trim(),
        phone: appPhone.trim(),
        socialChannels: appSocial.trim(),
        bankName: appBankName,
        accountHolder: appAccountHolder.trim(),
        iban: appIban.trim(),
        notes: appNotes.trim()
      });
      setAppSuccessMessage('تم إرسال طلبك بنجاح! سيتم مراجعته وتفعيل حسابك خلال 24 ساعة.');
    } catch (err: any) {
      setAppErrorMessage(err.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setSubmittingApp(false);
    }
  };

  // Submit Payout Request
  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || payoutAmount <= 0) {
      setPayoutMessage({ type: 'error', text: 'يرجى إدخال مبلغ صحيح' });
      return;
    }
    if (!payoutIban.trim()) {
      setPayoutMessage({ type: 'error', text: 'يرجى إدخال رقم الآيبان البنكي' });
      return;
    }

    setSubmittingPayout(true);
    setPayoutMessage(null);
    try {
      await requestPayout(payoutAmount, payoutBank, payoutHolder, payoutIban);
      setPayoutMessage({ type: 'success', text: 'تم تقديم طلب السحب بنجاح، ستتم معالجته خلال أيام العمل.' });
      setTimeout(() => {
        setIsPayoutModalOpen(false);
        setPayoutMessage(null);
      }, 2000);
    } catch (err: any) {
      setPayoutMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء تقديم طلب السحب' });
    } finally {
      setSubmittingPayout(false);
    }
  };

  // Payouts for current affiliate
  const affiliatePayouts = currentAffiliateProfile 
    ? payouts.filter(p => p.affiliateId === currentAffiliateProfile.id)
    : [];

  // Attributed orders for current affiliate
  const attributedOrders = currentAffiliateProfile
    ? orders.filter(o => o.affiliateId === currentAffiliateProfile.id || o.affiliateCode === currentAffiliateProfile.referralCode)
    : [];

  // 1. Not Logged In View
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFF0F4] border border-[#F8DDE6] px-4 py-1.5 rounded-full text-xs font-bold text-[#AD647D]">
            <Sparkles className="w-4 h-4 text-[#C9A46A]" />
            <span>برنامج شركاء النجاح وصنّاع المحتوى</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2D141E] font-serif-lux">
            انضم إلى برنامج Flora Faten للتسويق بالعمولة
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            شارك جمال باقاتنا الفاخرة وتنسيقاتنا الراقية مع متابعيك واكسب عمولات مجزية على كل طلب يتم عبر كودك أو رابطك الخاص.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#F8DDE6] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#2D141E]">عمولات مجزية تصل 15%</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              احصل على عمولة نقدية على كل طلب مكتمل، بالإضافة إلى كود خصم خاص لمتابعيك.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F8DDE6] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#2D141E]">لوحة تحكم وإحصائيات حية</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              تتبع نقراتك، عدد الطلبات، والمبيعات المتحققة، وأرباحك اللحظية بدقة متناهية.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F8DDE6] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] text-[#AD647D] flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#2D141E]">تحويل بنكي مباشر</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              اسحب أرباحك مباشرة إلى حسابك البنكي في أي بنك سعودي بكل سهولة وسرعة.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#FFF5F8] via-[#FFF9FA] to-[#FFF5F8] border border-[#F8DDE6] p-8 rounded-3xl text-center space-y-4">
          <h2 className="text-xl font-bold text-[#AD647D]">ابدأ رحلتك كشريك نجاح اليوم</h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            سجل دخولك إلى حسابك أو أنشئ حساباً جديداً للتقديم على برنامج التسويق بالعمولة.
          </p>
          <button
            onClick={() => onNavigate('account')}
            className="py-3 px-8 bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] hover:opacity-95 text-white font-bold text-sm rounded-2xl shadow-sm transition inline-flex items-center gap-2"
          >
            <span>تسجيل الدخول والتقديم الآن</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Pending Application View
  if (currentAffiliateProfile && currentAffiliateProfile.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-[#2D141E]">طلبك قيد المراجعة</h1>
        <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
          شكراً لاهتمامك بالانضمام إلى شركاء نجاح Flora Faten! فريقنا يقوم حالياً بمراجعة قنواتك التسويقية واعتماد كود الخصم المخصص لك. سيتم التفعيل قريباً.
        </p>

        <div className="bg-white p-6 rounded-3xl border border-[#F8DDE6] text-right space-y-3 text-xs">
          <div className="flex justify-between border-b border-pink-50 pb-2">
            <span className="text-gray-500">الاسم:</span>
            <span className="font-bold text-[#2D141E]">{currentAffiliateProfile.name}</span>
          </div>
          <div className="flex justify-between border-b border-pink-50 pb-2">
            <span className="text-gray-500">الكود المقترح:</span>
            <span className="font-bold text-[#AD647D] font-mono">{currentAffiliateProfile.referralCode}</span>
          </div>
          <div className="flex justify-between border-b border-pink-50 pb-2">
            <span className="text-gray-500">القنوات الاجتماعية:</span>
            <span className="font-semibold text-gray-700">{currentAffiliateProfile.socialChannels}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-500">تاريخ التقديم:</span>
            <span className="text-gray-600">{new Date(currentAffiliateProfile.appliedAt).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="py-2.5 px-6 border border-[#F8DDE6] text-[#AD647D] hover:bg-pink-50 text-xs font-bold rounded-xl transition"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  // 3. User Not Yet Applied -> Application Form
  if (!currentAffiliateProfile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-fadeIn space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#FFF0F4] border border-[#F8DDE6] px-3.5 py-1 rounded-full text-xs font-bold text-[#AD647D]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A46A]" />
            <span>طلب انضمام لصنّاع المحتوى والمسوقين</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
            نموذج التقديم لبرنامج التسويق بالعمولة
          </h1>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            املاً البيانات التالية وسيقوم فريق Flora Faten بمراجعة طلبك وتزويدك بكود خصم ورابط إحالة خاصين بك.
          </p>
        </div>

        {appSuccessMessage ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-base">تم استلام طلبك بنجاح!</h3>
            <p className="text-xs text-emerald-700">{appSuccessMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="bg-white border border-[#F8DDE6] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {appErrorMessage && (
              <div className="bg-[#FFF0F3] border border-[#F8DDE6] text-[#A63A50] px-4 py-3 rounded-2xl text-xs flex items-center justify-between gap-2 animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#A63A50] shrink-0" />
                  <span className="font-semibold">{appErrorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppErrorMessage(null)}
                  className="text-[#A63A50]/70 hover:text-[#A63A50] p-1 cursor-pointer transition"
                  title="إغلاق التنبيه"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="اسمك الثلاثي"
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden focus:border-[#AD647D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الجوال (واتساب) *</label>
                <input
                  type="tel"
                  required
                  value={appPhone}
                  onChange={(e) => setAppPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden focus:border-[#AD647D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                حساباتك وقنواتك في وسائل التواصل الاجتماعي *
              </label>
              <input
                type="text"
                required
                value={appSocial}
                onChange={(e) => setAppSocial(e.target.value)}
                placeholder="سناب شات: @name / تيك توك: @name / إنستغرام: @name"
                className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden focus:border-[#AD647D]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                يرجى كتابة الحسابات التي ستشارك منتجات Flora Faten عليها.
              </span>
            </div>

            {/* Bank details for payouts */}
            <div className="border-t border-[#F8DDE6] pt-5 space-y-4">
              <h3 className="text-xs font-bold text-[#AD647D] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#C9A46A]" />
                <span>بيانات التحويل البنكي (لاستلام أرباحك لاحقاً)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">اسم البنك</label>
                  <select
                    value={appBankName}
                    onChange={(e) => setAppBankName(e.target.value)}
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden"
                  >
                    <option value="مصرف الراجحي">مصرف الراجحي</option>
                    <option value="البنك الأهلي السعودي (SNB)">البنك الأهلي السعودي (SNB)</option>
                    <option value="مصرف الإنماء">مصرف الإنماء</option>
                    <option value="بنك الرياض">بنك الرياض</option>
                    <option value="بنك البلاد">بنك البلاد</option>
                    <option value="البنك الأول (SABB)">البنك الأول (SABB)</option>
                    <option value="أخرى">بنك آخر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">اسم صاحب الحساب</label>
                  <input
                    type="text"
                    value={appAccountHolder}
                    onChange={(e) => setAppAccountHolder(e.target.value)}
                    placeholder="مطابق لاسم المستفيد في البنك"
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">رقم الآيبان البنكي (IBAN)</label>
                <input
                  type="text"
                  value={appIban}
                  onChange={(e) => setAppIban(e.target.value.toUpperCase())}
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs font-mono tracking-wider focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">نبذة عن خطتك الترويجية أو ملاحظات إضافية</label>
              <textarea
                rows={3}
                value={appNotes}
                onChange={(e) => setAppNotes(e.target.value)}
                placeholder="أخبرنا عن نوع المحتوى أو المناسبات التي تركز عليها..."
                className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="agreeAffTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#AD647D] focus:ring-[#AD647D]"
              />
              <label htmlFor="agreeAffTerms" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                أوافق على الشروط والأحكام الخاصة ببرنامج التسويق بالعمولة لمتجر Flora Faten وأتعهد بالالتزام بأخلاقيات التسويق والمصداقية.
              </label>
            </div>

            <button
              type="submit"
              disabled={submittingApp}
              className="w-full py-3.5 bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] hover:opacity-95 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
            >
              {submittingApp ? (
                <span>جاري إرسال الطلب...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تقديم طلب الانضمام الآن</span>
                </>
              )}
            </button>

          </form>
        )}
      </div>
    );
  }

  // 4. Approved Affiliate View -> Full Interactive Affiliate Portal
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F4] via-white to-[#FFF0F4] border border-[#F8DDE6] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#C9A46A] text-white text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              شريك معتمد
            </span>
            <span className="text-xs text-gray-400">
              انضم في: {new Date(currentAffiliateProfile.appliedAt).toLocaleDateString('ar-SA')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
            مرحباً، {currentAffiliateProfile.name} 🌸
          </h1>
          <p className="text-xs text-gray-500">
            لوحة تحكم المسوق وصانع المحتوى لمتجر Flora Faten الفاخر
          </p>
        </div>

        {/* Quick Action: Withdraw Payout */}
        <button
          onClick={() => setIsPayoutModalOpen(true)}
          className="py-3 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-2xl text-xs font-bold shadow-sm transition flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <CreditCard className="w-4 h-4" />
          <span>طلب سحب الأرباح</span>
        </button>
      </div>

      {/* Referral Code & Link Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Affiliate Coupon Card */}
        <div className="bg-white border-2 border-dashed border-[#E7A0B4] rounded-3xl p-6 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <BadgePercent className="w-4 h-4 text-[#AD647D]" />
              كود الخصم المخصص لك
            </span>
            <span className="bg-[#FFF0F4] text-[#AD647D] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              خصم {currentAffiliateProfile.customerDiscountPercent}% للمشتري
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl p-3">
            <span className="font-mono text-xl font-black text-[#AD647D] tracking-widest">
              {currentAffiliateProfile.referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="py-2 px-3.5 bg-[#AD647D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:opacity-90 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            عمولتك: <strong className="text-[#2D141E]">{currentAffiliateProfile.commissionValue}{currentAffiliateProfile.commissionType === 'percentage' ? '%' : ' ر.س'}</strong> عن كل طلب يتم باستخدام هذا الكود.
          </p>
        </div>

        {/* Affiliate Referral Link Card */}
        <div className="bg-white border border-[#F8DDE6] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-[#C9A46A]" />
              رابط الإحالة المباشر
            </span>
            <span className="text-[11px] text-gray-400">تتبع تلقائي للزيارات</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl p-2.5">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="w-full bg-transparent text-xs text-gray-700 font-mono focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className="py-1.5 px-3 bg-[#C9A46A] hover:bg-[#B38F56] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition whitespace-nowrap"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>مشاركة واتساب</span>
            </button>
            <button
              onClick={handleCopyPromo}
              className="flex-1 py-2 bg-[#FFF0F4] hover:bg-[#F8DDE6] text-[#AD647D] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {copiedPromoText ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{copiedPromoText ? 'تم نسخ النص' : 'نص الإعلان الجاهز'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Live Performance Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-[#F8DDE6] text-center space-y-1">
          <span className="text-[11px] text-gray-400 block">الزيارات / النقرات</span>
          <span className="text-xl font-black text-[#2D141E]">{currentAffiliateProfile.totalClicks || 0}</span>
          <span className="text-[10px] text-gray-400 block">نقرة رابط</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#F8DDE6] text-center space-y-1">
          <span className="text-[11px] text-gray-400 block">الطلبات المحققة</span>
          <span className="text-xl font-black text-[#AD647D]">{currentAffiliateProfile.totalOrders || 0}</span>
          <span className="text-[10px] text-gray-400 block">طلب مكتمل</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#F8DDE6] text-center space-y-1">
          <span className="text-[11px] text-gray-400 block">إجمالي المبيعات</span>
          <span className="text-xl font-black text-[#2D141E]">{currentAffiliateProfile.totalSales || 0}</span>
          <span className="text-[10px] text-[#C9A46A] font-bold block">ر.س</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#F8DDE6] text-center space-y-1">
          <span className="text-[11px] text-gray-400 block">إجمالي الأرباح</span>
          <span className="text-xl font-black text-emerald-600">{currentAffiliateProfile.totalEarnings || 0}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">ر.س</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#F8DDE6] text-center space-y-1">
          <span className="text-[11px] text-gray-400 block">العمولات المستلمة</span>
          <span className="text-xl font-black text-gray-700">{currentAffiliateProfile.paidEarnings || 0}</span>
          <span className="text-[10px] text-gray-400 block">ر.س مدفوعة</span>
        </div>

        <div className="bg-gradient-to-b from-[#FFF5F8] to-white p-4 rounded-2xl border-2 border-[#E7A0B4] text-center space-y-1">
          <span className="text-[11px] font-bold text-[#AD647D] block">الرصيد المتاح للسحب</span>
          <span className="text-xl font-black text-[#AD647D]">{currentAffiliateProfile.pendingBalance || 0}</span>
          <span className="text-[10px] text-[#AD647D] font-bold block">ر.س متاح</span>
        </div>

      </div>

      {/* Orders & Commissions History */}
      <div className="bg-white border border-[#F8DDE6] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F8DDE6]">
          <h3 className="font-bold text-sm text-[#2D141E] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#AD647D]" />
            <span>سجل الطلبات والعمولات المحققة عبر كودك ({attributedOrders.length})</span>
          </h3>
          <span className="text-xs text-gray-400">تحديث لحظي من قاعدة البيانات</span>
        </div>

        {attributedOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 border border-dashed border-[#F8DDE6] rounded-2xl">
            لا توجد طلبات مسجلة بكودك حتى الآن. شارك كودك ورابطك مع جمهورك للبدء في جني العمولات!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[#FFF9FA] text-gray-500">
                  <th className="py-2.5 px-3 rounded-r-xl">رقم الطلب</th>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">قيمة الطلب</th>
                  <th className="py-2.5 px-3">عمولتك</th>
                  <th className="py-2.5 px-3">حالة الطلب</th>
                  <th className="py-2.5 px-3 rounded-l-xl">حالة العمولة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {attributedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FFFDFD]">
                    <td className="py-3 px-3 font-mono font-bold text-[#AD647D]">{ord.orderNumber}</td>
                    <td className="py-3 px-3 text-gray-500">{new Date(ord.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td className="py-3 px-3 font-bold text-gray-700">{ord.total} ر.س</td>
                    <td className="py-3 px-3 font-black text-emerald-600">
                      {ord.commissionAmount || Math.round((ord.subtotal * (currentAffiliateProfile.commissionValue || 10)) / 100)} ر.س
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#FFF0F4] text-[#AD647D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'completed' || ord.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.status === 'completed' || ord.status === 'paid' ? 'معتمدة ومضافة' : 'قيد اكتمال الطلب'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Requests History */}
      <div className="bg-white border border-[#F8DDE6] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F8DDE6]">
          <h3 className="font-bold text-sm text-[#2D141E] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#C9A46A]" />
            <span>سجل طلبات سحب الأرباح والتحويلات البنكية</span>
          </h3>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="text-xs text-[#AD647D] font-bold underline"
          >
            طلب سحب جديد
          </button>
        </div>

        {affiliatePayouts.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400">
            لم تقم بتقديم طلبات سحب سابقة.
          </div>
        ) : (
          <div className="divide-y divide-pink-50">
            {affiliatePayouts.map((pay) => (
              <div key={pay.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2D141E]">{pay.amount} ر.س</span>
                    <span className="text-gray-400">• {pay.bankName}</span>
                    <span className="text-gray-400 font-mono text-[11px]">({pay.iban})</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    تاريخ الطلب: {new Date(pay.requestedAt).toLocaleDateString('ar-SA')}
                    {pay.transactionReference && (
                      <span className="mr-2 text-emerald-600 font-mono">مرجع التحويل: {pay.transactionReference}</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    pay.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700'
                      : pay.status === 'rejected'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {pay.status === 'paid' ? 'تم التحويل بنجاح' : pay.status === 'rejected' ? 'مرفوض' : 'قيد التنفيذ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marketing Kit Box */}
      <div className="bg-gradient-to-r from-[#FFF9FA] via-white to-[#FFF9FA] border border-[#F8DDE6] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#AD647D]">
          <Download className="w-5 h-5 text-[#C9A46A]" />
          <h3 className="font-bold text-sm">المواد التسويقية ونصوص النشر الجاهزة</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          انسخ نص الإعلان أو استخدمه في الستوري أو البايو الخاص بك في منصات التواصل (Snapchat, Instagram, TikTok, X).
        </p>

        <div className="bg-white border border-[#F8DDE6] rounded-2xl p-4 space-y-3">
          <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap leading-relaxed select-all">
            {promoTemplate}
          </pre>
          <div className="flex justify-end">
            <button
              onClick={handleCopyPromo}
              className="py-1.5 px-4 bg-[#AD647D] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              {copiedPromoText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPromoText ? 'تم نسخ النص بالكامل' : 'نسخ النص'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8DDE6]">
              <h3 className="font-bold text-base text-[#2D141E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C9A46A]" />
                <span>طلب سحب أرباح التسويق</span>
              </h3>
              <button onClick={() => setIsPayoutModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="bg-[#FFF0F4] p-3 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-gray-600">الرصيد المتاح للسحب:</span>
              <span className="font-black text-[#AD647D] text-sm">{currentAffiliateProfile.pendingBalance || 0} ر.س</span>
            </div>

            {payoutMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                payoutMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {payoutMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitPayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">المبلغ المطلوب سحبه (ر.س) *</label>
                <input
                  type="number"
                  min="50"
                  max={currentAffiliateProfile.pendingBalance || 0}
                  required
                  value={payoutAmount || ''}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  placeholder="مثال: 200"
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم البنك</label>
                <select
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden"
                >
                  <option value="مصرف الراجحي">مصرف الراجحي</option>
                  <option value="البنك الأهلي السعودي (SNB)">البنك الأهلي السعودي (SNB)</option>
                  <option value="مصرف الإنماء">مصرف الإنماء</option>
                  <option value="بنك الرياض">بنك الرياض</option>
                  <option value="بنك البلاد">بنك البلاد</option>
                  <option value="أخرى">بنك آخر</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم صاحب الحساب المستفيد</label>
                <input
                  type="text"
                  required
                  value={payoutHolder}
                  onChange={(e) => setPayoutHolder(e.target.value)}
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رقم الآيبان (IBAN) *</label>
                <input
                  type="text"
                  required
                  value={payoutIban}
                  onChange={(e) => setPayoutIban(e.target.value.toUpperCase())}
                  placeholder="SA..."
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs font-mono tracking-wider focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#F8DDE6] text-gray-600 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="flex-1 py-2.5 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl font-bold shadow-xs transition"
                >
                  {submittingPayout ? 'جاري الإرسال...' : 'تأكيد طلب السحب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
