import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  MoveUp, 
  MoveDown, 
  Upload, 
  Image as ImageIcon, 
  Smartphone, 
  Monitor, 
  Link2, 
  Sliders, 
  Clock, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Banner, BannerLinkType, BannerSliderSettings } from '../../types';

export const BannerManager: React.FC = () => {
  const { 
    banners, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    reorderBanners, 
    uploadBannerImage,
    bannerSliderSettings,
    updateBannerSliderSettings,
    categories,
    products
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Form State for Adding / Editing
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    imageUrl: string;
    mobileImageUrl: string;
    altText: string;
    linkType: BannerLinkType;
    linkValue: string;
    buttonText: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    objectFit: 'cover' | 'contain' | 'fill';
  }>({
    title: '',
    subtitle: '',
    imageUrl: '',
    mobileImageUrl: '',
    altText: '',
    linkType: 'category',
    linkValue: categories[0]?.slug || 'pink-white-bouquets',
    buttonText: 'تسوق الآن',
    isActive: true,
    startDate: '',
    endDate: '',
    objectFit: 'cover'
  });

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  // Open Modal to Add
  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      mobileImageUrl: '',
      altText: '',
      linkType: 'category',
      linkValue: categories[0]?.slug || 'pink-white-bouquets',
      buttonText: 'تسوق الآن',
      isActive: true,
      startDate: '',
      endDate: '',
      objectFit: 'cover'
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      mobileImageUrl: banner.mobileImageUrl || '',
      altText: banner.altText || '',
      linkType: banner.linkType || 'none',
      linkValue: banner.linkValue || '',
      buttonText: banner.buttonText || '',
      isActive: banner.isActive !== false,
      startDate: banner.startDate || '',
      endDate: banner.endDate || '',
      objectFit: banner.objectFit || 'cover'
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Handle Desktop Image File Upload
  const handleDesktopFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);
      const url = await uploadBannerImage(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      setErrorMessage(err?.message || 'فشل رفع صورة البنر');
    } finally {
      setIsUploading(false);
      if (desktopFileInputRef.current) desktopFileInputRef.current.value = '';
    }
  };

  // Handle Mobile Image File Upload
  const handleMobileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح للجوال');
      return;
    }

    try {
      setIsUploadingMobile(true);
      setErrorMessage(null);
      const url = await uploadBannerImage(file);
      setFormData(prev => ({ ...prev, mobileImageUrl: url }));
    } catch (err: any) {
      setErrorMessage(err?.message || 'فشل رفع صورة الجوال');
    } finally {
      setIsUploadingMobile(false);
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
    }
  };

  // Handle Submit Banner Form
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setErrorMessage('يرجى رفع أو إدخال رابط صورة البنر للكمبيوتر');
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, {
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim(),
          imageUrl: formData.imageUrl.trim(),
          mobileImageUrl: formData.mobileImageUrl.trim() || undefined,
          altText: formData.altText.trim() || formData.title.trim() || 'بنر فلورا فاتن',
          linkType: formData.linkType,
          linkValue: formData.linkValue.trim(),
          buttonText: formData.buttonText.trim(),
          isActive: formData.isActive,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          objectFit: formData.objectFit
        });
        showFeedback('تم تحديث البنر بنجاح في قاعدة البيانات ✅');
      } else {
        await addBanner({
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim(),
          imageUrl: formData.imageUrl.trim(),
          mobileImageUrl: formData.mobileImageUrl.trim() || undefined,
          altText: formData.altText.trim() || formData.title.trim() || 'بنر فلورا فاتن',
          linkType: formData.linkType,
          linkValue: formData.linkValue.trim(),
          buttonText: formData.buttonText.trim(),
          isActive: formData.isActive,
          order: banners.length + 1,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          objectFit: formData.objectFit
        });
        showFeedback('تم إضافة البنر ونشره بنجاح في المتجر ✅');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء حفظ البنر');
    }
  };

  // Handle Delete Banner
  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا البنر؟')) return;
    try {
      await deleteBanner(bannerId);
      showFeedback('تم حذف البنر بنجاح');
    } catch (err: any) {
      setErrorMessage(err?.message || 'فشل حذف البنر');
    }
  };

  // Handle Toggle Active
  const handleToggleActive = async (banner: Banner) => {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      showFeedback(banner.isActive ? 'تم تعطيل البنر' : 'تم تفعيل البنر');
    } catch (err: any) {
      setErrorMessage(err?.message || 'فشل تغيير حالة البنر');
    }
  };

  // Handle Move Up / Down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      await reorderBanners(reordered);
      showFeedback('تم تحديث ترتيب البنرات');
    } catch (err: any) {
      setErrorMessage(err?.message || 'فشل حفظ الترتيب');
    }
  };

  const showFeedback = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Alert */}
      {saveSuccessMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn border border-emerald-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FFF0F4] text-[#AD647D]">
              <ImageIcon className="w-5 h-5 text-[#C9A46A]" />
            </span>
            <h3 className="text-base font-bold text-[#2D141E]">
              إدارة البنرات الرئيسية (Hero Banners Slider)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            إضافة وتعديل البنرات التسويقية الكبيرة أسفل الهيدر، مع دعم صور خاصة للجوال وصور للكمبيوتر، وتخصيص الروابط ومدة العرض.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="py-3 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة بنر رئيسي جديد</span>
        </button>
      </div>

      {/* Global Slider Settings Card */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-5 shadow-xs">
        <h4 className="text-xs font-bold text-[#AD647D] flex items-center gap-2 border-b border-pink-100 pb-3">
          <Sliders className="w-4 h-4" />
          <span>إعدادات السلايدر والتحكم في الانتقال</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Auto-Play Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2D141E] block">التبديل التلقائي</span>
              <span className="text-[10px] text-gray-500">الانتقال الدائري بين البنرات</span>
            </div>
            <input
              type="checkbox"
              checked={bannerSliderSettings.autoPlay}
              onChange={(e) => updateBannerSliderSettings({ autoPlay: e.target.checked })}
              className="w-4 h-4 accent-[#AD647D] cursor-pointer"
            />
          </div>

          {/* Interval Seconds */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#2D141E]">مدة الانتقال</span>
              <span className="font-bold text-[#AD647D]">{bannerSliderSettings.intervalSeconds || 3} ثوانٍ</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={bannerSliderSettings.intervalSeconds || 3}
              onChange={(e) => updateBannerSliderSettings({ intervalSeconds: Number(e.target.value) })}
              className="w-full accent-[#AD647D] cursor-pointer"
            />
          </div>

          {/* Pause on hover */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2D141E] block">إيقاف عند اللمس/المرور</span>
              <span className="text-[10px] text-gray-500">تجميد التبديل أثناء تفاعل الزائر</span>
            </div>
            <input
              type="checkbox"
              checked={bannerSliderSettings.pauseOnHover}
              onChange={(e) => updateBannerSliderSettings({ pauseOnHover: e.target.checked })}
              className="w-4 h-4 accent-[#AD647D] cursor-pointer"
            />
          </div>

          {/* Show Arrows & Dots */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2D141E] block">أسهم ومؤشرات السلايدر</span>
              <span className="text-[10px] text-gray-500">إظهار أزرار التنقل ونقاط التتابع</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-gray-600 flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerSliderSettings.showArrows}
                  onChange={(e) => updateBannerSliderSettings({ showArrows: e.target.checked })}
                  className="accent-[#AD647D]"
                />
                <span>أسهم</span>
              </label>
              <label className="text-[10px] text-gray-600 flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerSliderSettings.showDots}
                  onChange={(e) => updateBannerSliderSettings({ showDots: e.target.checked })}
                  className="accent-[#AD647D]"
                />
                <span>نقاط</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <h4 className="text-xs font-bold text-[#2D141E]">
            قائمة البنرات النشطة والمعروضة ({banners.length})
          </h4>
          <span className="text-[11px] text-[#AD647D]">
            يمكنك تغيير الترتيب باستخدام أسهم الصعود والنزول
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <ImageIcon className="w-12 h-12 text-pink-200 mx-auto" />
            <p className="text-xs font-bold">لا توجد بنرات مضافة حتى الآن.</p>
            <button
              onClick={handleOpenAddModal}
              className="text-xs text-[#AD647D] font-bold hover:underline"
            >
              + إضافة أول بنر تسويقي
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  banner.isActive 
                    ? 'bg-white border-[#F8DDE6] hover:border-[#AD647D]/50' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                {/* Banner Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div className="w-28 sm:w-36 h-16 sm:h-20 rounded-xl overflow-hidden bg-gray-100 border border-[#F8DDE6] shrink-0 relative">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.altText} 
                      className="w-full h-full object-cover"
                    />
                    {banner.mobileImageUrl && (
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 py-0.2 rounded-sm font-mono" title="يتضمن نسخة مخصصة للجوال">
                        +جوال
                      </span>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-[#FFF0F4] text-[#AD647D] text-[11px] font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h5 className="text-xs font-bold text-[#2D141E] truncate">
                        {banner.title || 'بنر بدون عنوان'}
                      </h5>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        banner.isActive 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}>
                        {banner.isActive ? 'مفعّل بالمتجر' : 'معطّل مؤقتاً'}
                      </span>
                    </div>

                    {banner.subtitle && (
                      <p className="text-[11px] text-gray-500 line-clamp-1">
                        {banner.subtitle}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-gray-400 flex-wrap">
                      {banner.linkType && banner.linkType !== 'none' && (
                        <span className="flex items-center gap-1 text-[#AD647D]">
                          <Link2 className="w-3 h-3" />
                          <span>رابط ({banner.linkType}): {banner.linkValue}</span>
                        </span>
                      )}
                      {banner.buttonText && (
                        <span>زر: "{banner.buttonText}"</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions & Reordering Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-2 rounded-xl border border-[#F8DDE6] hover:bg-pink-50 text-[#AD647D] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="تحريك لأعلى"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === banners.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-2 rounded-xl border border-[#F8DDE6] hover:bg-pink-50 text-[#AD647D] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="تحريك لأسفل"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      banner.isActive
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {banner.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(banner)}
                    className="p-2 rounded-xl bg-[#FFF0F4] border border-[#F8DDE6] text-[#AD647D] hover:bg-[#F8DDE6] transition cursor-pointer"
                    title="تعديل البنر"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition cursor-pointer"
                    title="حذف البنر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT BANNER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F8DDE6] overflow-hidden my-6 max-h-[92vh] flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#F8DDE6] bg-[#FFF9FA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#AD647D]" />
                <h3 className="text-base font-bold text-[#2D141E]">
                  {editingBanner ? 'تعديل بيانات البنر الرئيسي' : 'إضافة بنر رئيسي جديد'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-pink-100 text-[#AD647D] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveBanner} className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    عنوان البنر الرئيسي (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: باقات الوردي والأبيض الملكية"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    الوصف الترويجي القصير (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: ورود هولندية طبيعية بتغليف شمعي فاخر"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Desktop Image Input & Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-[#AD647D]" />
                    <span>صورة البنر للكمبيوتر (مطلوبة - نسبة 21:9 أو 16:9)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => desktopFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-xs font-bold text-[#AD647D] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>رفع من جهازك</span>
                  </button>
                  <input
                    type="file"
                    ref={desktopFileInputRef}
                    accept="image/*"
                    onChange={handleDesktopFileChange}
                    className="hidden"
                  />
                </div>

                <input
                  type="url"
                  required
                  placeholder="https://example.com/banner.jpg أو اضغط رفع من جهازك"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-left font-mono focus:border-[#AD647D] focus:outline-hidden"
                  dir="ltr"
                />
              </div>

              {/* Mobile Image Input & Upload (Optional) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#C9A46A]" />
                    <span>صورة خاصة للجوال (اختيارية - نسبة 16:9 أو 4:3)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => mobileFileInputRef.current?.click()}
                    disabled={isUploadingMobile}
                    className="text-xs font-bold text-[#C9A46A] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingMobile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>رفع صورة للجوال</span>
                  </button>
                  <input
                    type="file"
                    ref={mobileFileInputRef}
                    accept="image/*"
                    onChange={handleMobileFileChange}
                    className="hidden"
                  />
                </div>

                <input
                  type="url"
                  placeholder="رابط صورة مخصصة لشاشات الجوال (اختياري، إن لم تحدد ستُستخدم صورة الكمبيوتر)"
                  value={formData.mobileImageUrl}
                  onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-left font-mono focus:border-[#AD647D] focus:outline-hidden"
                  dir="ltr"
                />
              </div>

              {/* Alt Text for Accessibility */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  النص البديل للصورة (Alt Text - لمحركات البحث وإمكانية الوصول)
                </label>
                <input
                  type="text"
                  placeholder="مثال: باقة جوري هولندية فاخرة بتغليف وردي"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                />
              </div>

              {/* Link Type & Target Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نوع الرابط</label>
                  <select
                    value={formData.linkType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      linkType: e.target.value as BannerLinkType,
                      linkValue: e.target.value === 'category' ? (categories[0]?.slug || '') : ''
                    })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                  >
                    <option value="none">بدون رابط (صورة فقط)</option>
                    <option value="category">قسم / تصنيف بالمتجر</option>
                    <option value="product">منتج محدد</option>
                    <option value="page">صفحة بالمتجر</option>
                    <option value="custom">رابط مخصص أو خارجي</option>
                  </select>
                </div>

                {formData.linkType === 'category' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">اختر التصنيف</label>
                    <select
                      value={formData.linkValue}
                      onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                      className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.linkType === 'product' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">اختر المنتج</label>
                    <select
                      value={formData.linkValue}
                      onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                      className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.price} ر.س)</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.linkType === 'page' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">اختر الصفحة</label>
                    <select
                      value={formData.linkValue}
                      onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                      className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                    >
                      <option value="products">كافة الباقات والمنتجات</option>
                      <option value="tracking">تتبع الطلبات والشحنات</option>
                      <option value="affiliate">بوابة التسويق بالعمولة</option>
                      <option value="about">من نحن - قصة فلورا فاتن</option>
                      <option value="contact">اتصل بنا</option>
                      <option value="policy">الشروط وسياسة الاسترجاع</option>
                    </select>
                  </div>
                )}

                {formData.linkType === 'custom' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">الرابط المخصص</label>
                    <input
                      type="text"
                      placeholder="https://wa.me/... أو رابط الحملة"
                      value={formData.linkValue}
                      onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                      className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>

              {/* Button text & Active toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نص زر الإجراء</label>
                  <input
                    type="text"
                    placeholder="مثال: تسوق الآن، اكتشف الباقة"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs focus:border-[#AD647D] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="bannerActiveCheckbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#AD647D] cursor-pointer"
                  />
                  <label htmlFor="bannerActiveCheckbox" className="text-xs font-bold text-gray-700 cursor-pointer">
                    تفعيل البنر فوراً وإظهاره في المتجر
                  </label>
                </div>
              </div>

              {/* Live Preview Inside Modal */}
              {formData.imageUrl && (
                <div className="space-y-2 pt-2 border-t border-pink-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#AD647D] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة فورية لتصميم البنر</span>
                    </span>
                    <div className="flex items-center gap-1 bg-pink-50 p-0.5 rounded-lg border border-[#F8DDE6]">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('desktop')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                          previewMode === 'desktop' ? 'bg-[#AD647D] text-white' : 'text-gray-600'
                        }`}
                      >
                        الكمبيوتر
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('mobile')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                          previewMode === 'mobile' ? 'bg-[#AD647D] text-white' : 'text-gray-600'
                        }`}
                      >
                        الجوال
                      </button>
                    </div>
                  </div>

                  <div className={`mx-auto rounded-2xl overflow-hidden border border-[#F8DDE6] shadow-md relative bg-black/10 transition-all ${
                    previewMode === 'mobile' ? 'max-w-xs aspect-[16/9]' : 'w-full aspect-[21/9]'
                  }`}>
                    <img
                      src={(previewMode === 'mobile' && formData.mobileImageUrl) ? formData.mobileImageUrl : formData.imageUrl}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                    {(formData.title || formData.subtitle) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-4 text-white text-right">
                        {formData.title && <h4 className="text-sm sm:text-base font-bold font-serif-lux">{formData.title}</h4>}
                        {formData.subtitle && <p className="text-[10px] sm:text-xs text-pink-100 line-clamp-1">{formData.subtitle}</p>}
                        {formData.buttonText && (
                          <span className="mt-1 text-[9px] font-bold px-2 py-0.5 bg-[#AD647D] rounded-full self-start">
                            {formData.buttonText}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F8DDE6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#AD647D] hover:bg-[#8C465F] text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBanner ? 'حفظ التعديلات' : 'نشر البنر في المتجر'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
