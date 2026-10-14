import React, { useState } from 'react';
import { 
  Sparkles, 
  Gift, 
  Tag, 
  Truck, 
  Heart, 
  Bell, 
  Phone, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  MoveUp, 
  MoveDown, 
  Palette, 
  Link2, 
  Play, 
  Sliders, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Copy,
  Info
} from 'lucide-react';
import { 
  AnnouncementSettings, 
  AnnouncementItem, 
  AnnouncementIconType, 
  AnnouncementLinkType, 
  AnnouncementMode, 
  AnnouncementSpeed, 
  Product, 
  Category, 
  Coupon 
} from '../../types';
import { DEFAULT_ANNOUNCEMENT_SETTINGS } from '../../lib/initialData';

interface AnnouncementSettingsManagerProps {
  value: AnnouncementSettings;
  onChange: (updated: AnnouncementSettings) => void;
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
}

// Preset Luxury Color Schemes for Flora Faten
const COLOR_PRESETS = [
  {
    name: 'وردي فلورا الملكي (الافتراضي)',
    start: '#AD647D',
    end: '#8C465F',
    text: '#FFFFFF',
    accent: '#FFE680'
  },
  {
    name: 'ذهب وردي ومخمل بلش',
    start: '#C47B93',
    end: '#9D5069',
    text: '#FFFFFF',
    accent: '#FFF0BA'
  },
  {
    name: 'عنابي مخملي فاخر',
    start: '#661B30',
    end: '#420F1D',
    text: '#FFFFFF',
    accent: '#E6C687'
  },
  {
    name: 'شامبين ذهبي أنيق',
    start: '#8B6B3E',
    end: '#5C4423',
    text: '#FFFFFF',
    accent: '#FFF2C6'
  },
  {
    name: 'أسود ملكي وذهبي',
    start: '#211B20',
    end: '#141014',
    text: '#FFFFFF',
    accent: '#E5C158'
  }
];

export const AnnouncementSettingsManager: React.FC<AnnouncementSettingsManagerProps> = ({
  value,
  onChange,
  products,
  categories,
  coupons
}) => {
  // Ensure we have complete state
  const currentSettings: AnnouncementSettings = {
    ...DEFAULT_ANNOUNCEMENT_SETTINGS,
    ...value,
    messages: (value && value.messages && value.messages.length > 0)
      ? value.messages
      : DEFAULT_ANNOUNCEMENT_SETTINGS.messages
  };

  const [editingMessage, setEditingMessage] = useState<AnnouncementItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop');
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);

  // Helper to update settings
  const updateSettings = (partial: Partial<AnnouncementSettings>) => {
    onChange({
      ...currentSettings,
      ...partial
    });
  };

  // Toggle active status of a message
  const handleToggleMessageActive = (id: string) => {
    const updated = currentSettings.messages.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    updateSettings({ messages: updated });
  };

  // Delete message
  const handleDeleteMessage = (id: string) => {
    if (currentSettings.messages.length <= 1) {
      alert('يجب الإبقاء على رسالة إعلانية واحدة على الأقل');
      return;
    }
    const updated = currentSettings.messages.filter(m => m.id !== id);
    updateSettings({ messages: updated });
  };

  // Move message up or down
  const handleMoveMessage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSettings.messages.length) return;

    const list = [...currentSettings.messages];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    updateSettings({ messages: list });
  };

  // Open modal for new message
  const handleOpenNewMessageModal = () => {
    setEditingMessage({
      id: `ann-${Date.now()}`,
      text: '',
      badge: 'عرض حصري',
      icon: 'sparkles',
      linkType: 'none',
      linkValue: '',
      linkText: 'تسوق الآن',
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing message
  const handleOpenEditMessageModal = (msg: AnnouncementItem) => {
    setEditingMessage({ ...msg });
    setIsModalOpen(true);
  };

  // Save message from modal
  const handleSaveMessageModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage || !editingMessage.text.trim()) {
      alert('يرجى إدخال نص الإعلان أولاً');
      return;
    }

    const exists = currentSettings.messages.some(m => m.id === editingMessage.id);
    let updated: AnnouncementItem[];
    if (exists) {
      updated = currentSettings.messages.map(m => m.id === editingMessage.id ? editingMessage : m);
    } else {
      updated = [...currentSettings.messages, editingMessage];
    }

    updateSettings({ messages: updated });
    setIsModalOpen(false);
    setEditingMessage(null);
  };

  // Reset to default settings
  const handleResetDefaults = () => {
    if (confirm('هل تريد استعادة الإعدادات الافتراضية لشريط الإعلانات؟')) {
      onChange(DEFAULT_ANNOUNCEMENT_SETTINGS);
    }
  };

  // Render Icon helper
  const renderIcon = (type?: AnnouncementIconType, className = 'w-4 h-4') => {
    switch (type) {
      case 'gift': return <Gift className={className} />;
      case 'tag': return <Tag className={className} />;
      case 'truck': return <Truck className={className} />;
      case 'heart': return <Heart className={className} />;
      case 'bell': return <Bell className={className} />;
      case 'phone': return <Phone className={className} />;
      case 'sparkles':
      default: return <Sparkles className={className} />;
    }
  };

  const activeMessages = currentSettings.messages.filter(m => m.isActive);

  return (
    <div className="space-y-6">
      {/* Header with Master Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F8] via-[#FFF9FA] to-[#FFF0F4] border border-[#F8DDE6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#AD647D] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-[#FFE680]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2D141E] flex items-center gap-2">
              <span>شريط الإعلانات الترويجي أعلى المتجر</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentSettings.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentSettings.enabled ? 'مفعل ويعمل حالياً' : 'معطل'}
              </span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              عرض رسائل ترويجية متحركة، أكواد خصم قابلة للنسخ، روابط سريعة لمنتجاتك، وتنبيهات التوصيل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentSettings.enabled}
              onChange={(e) => updateSettings({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD647D]"></div>
            <span className="mr-3 text-xs font-bold text-[#4A2030]">
              {currentSettings.enabled ? 'تفعيل الشريط' : 'تعطيل الشريط'}
            </span>
          </label>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2 text-gray-400 hover:text-[#AD647D] hover:bg-pink-100/50 rounded-xl transition"
            title="استعادة الإعدادات الافتراضية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LIVE INTERACTIVE PREVIEW */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-[#2D141E]">معاينة حية وتفاعلية للشريط العلوي</span>
            <span className="text-[11px] text-gray-400">(يمكنك النقر والتمرير لتجربة تفاعل الزائر)</span>
          </div>
          <div className="flex items-center bg-[#FFF0F4] p-1 rounded-xl border border-[#F8DDE6]">
            <button
              type="button"
              onClick={() => setPreviewTab('desktop')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                previewTab === 'desktop' ? 'bg-white text-[#AD647D] shadow-xs' : 'text-gray-500'
              }`}
            >
              شاشة الكمبيوتر
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('mobile')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                previewTab === 'mobile' ? 'bg-white text-[#AD647D] shadow-xs' : 'text-gray-500'
              }`}
            >
              شاشة الجوال
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className={`mx-auto transition-all duration-300 ${
          previewTab === 'mobile' ? 'max-w-sm border-4 border-gray-800 rounded-2xl shadow-md p-1 bg-gray-50' : 'w-full'
        }`}>
          <div 
            dir="rtl"
            style={{
              background: `linear-gradient(135deg, ${currentSettings.bgColorStart} 0%, ${currentSettings.bgColorEnd} 100%)`,
              '--marquee-duration': currentSettings.speed === 'slow' ? '40s' : currentSettings.speed === 'fast' ? '14s' : '24s'
            } as any}
            className="relative w-full rounded-xl overflow-hidden min-h-[38px] flex items-center shadow-inner py-1.5"
          >
            {activeMessages.length === 0 ? (
              <div className="w-full text-center text-xs py-1 text-white/80">
                لا توجد رسائل مفعلة حالياً. يرجى تفعيل رسالة واحدة على الأقل.
              </div>
            ) : currentSettings.mode === 'marquee' ? (
              <div className={`w-full overflow-hidden flex items-center ${currentSettings.closable ? 'pl-8 pr-3' : 'px-3'}`}>
                <div className={`flex items-center ${
                  currentSettings.direction === 'ltr' ? 'announcement-marquee-ltr' : 'announcement-marquee-rtl'
                } ${currentSettings.pauseOnHover ? 'announcement-pause-hover' : ''}`}>
                  {[0, 1].map((loopIdx) => (
                    <div key={loopIdx} className="flex items-center">
                      {activeMessages.map((msg) => (
                        <div key={`${msg.id}-${loopIdx}`} className="inline-flex items-center gap-2 px-4 shrink-0">
                          {currentSettings.showIcon && (
                            <span style={{ color: currentSettings.accentColor }}>
                              {renderIcon(msg.icon, 'w-3.5 h-3.5')}
                            </span>
                          )}
                          {msg.badge && (
                            <span 
                              style={{ color: currentSettings.textColor }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 bg-white/20 whitespace-nowrap"
                            >
                              {msg.badge}
                            </span>
                          )}
                          <span style={{ color: currentSettings.textColor }} className="text-xs font-medium whitespace-nowrap">
                            {msg.text}
                          </span>
                          {msg.linkType && msg.linkType !== 'none' && (
                            <span 
                              style={{ backgroundColor: currentSettings.accentColor, color: '#3A1422' }}
                              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 shadow-2xs"
                            >
                              {msg.linkText || 'تسوق الآن'}
                            </span>
                          )}
                          <span className="opacity-40 text-xs px-2" style={{ color: currentSettings.accentColor }}>✦</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : currentSettings.mode === 'slideshow' ? (
              <div className={`w-full flex items-center justify-center relative ${currentSettings.closable ? 'pl-8 pr-6' : 'px-4'}`}>
                {activeMessages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPreviewSlideIndex(p => (p - 1 + activeMessages.length) % activeMessages.length)}
                    style={{ color: currentSettings.textColor }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {activeMessages[previewSlideIndex % activeMessages.length] && (
                  <div className="flex items-center gap-2 text-center">
                    {currentSettings.showIcon && (
                      <span style={{ color: currentSettings.accentColor }}>
                        {renderIcon(activeMessages[previewSlideIndex % activeMessages.length].icon, 'w-3.5 h-3.5')}
                      </span>
                    )}
                    {activeMessages[previewSlideIndex % activeMessages.length].badge && (
                      <span 
                        style={{ color: currentSettings.textColor }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 bg-white/20 whitespace-nowrap"
                      >
                        {activeMessages[previewSlideIndex % activeMessages.length].badge}
                      </span>
                    )}
                    <span style={{ color: currentSettings.textColor }} className="text-xs font-medium whitespace-nowrap">
                      {activeMessages[previewSlideIndex % activeMessages.length].text}
                    </span>
                    {activeMessages[previewSlideIndex % activeMessages.length].linkType !== 'none' && (
                      <span 
                        style={{ backgroundColor: currentSettings.accentColor, color: '#3A1422' }}
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                      >
                        {activeMessages[previewSlideIndex % activeMessages.length].linkText || 'تسوق الآن'}
                      </span>
                    )}
                  </div>
                )}
                {activeMessages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPreviewSlideIndex(p => (p + 1) % activeMessages.length)}
                    style={{ color: currentSettings.textColor }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className={`w-full flex items-center justify-center text-center ${currentSettings.closable ? 'pl-8 pr-3' : 'px-3'}`}>
                {activeMessages[0] && (
                  <div className="flex items-center gap-2">
                    {currentSettings.showIcon && (
                      <span style={{ color: currentSettings.accentColor }}>
                        {renderIcon(activeMessages[0].icon, 'w-3.5 h-3.5')}
                      </span>
                    )}
                    {activeMessages[0].badge && (
                      <span 
                        style={{ color: currentSettings.textColor }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 bg-white/20 whitespace-nowrap"
                      >
                        {activeMessages[0].badge}
                      </span>
                    )}
                    <span style={{ color: currentSettings.textColor }} className="text-xs font-medium whitespace-nowrap">
                      {activeMessages[0].text}
                    </span>
                  </div>
                )}
              </div>
            )}

            {currentSettings.closable && (
              <div 
                style={{ color: currentSettings.textColor }} 
                className="absolute left-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full opacity-70"
                title="زر الإغلاق المؤقت"
              >
                <X className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: ANIMATION & BEHAVIOR CONTROLS */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-5">
        <h4 className="text-xs font-bold text-[#AD647D] flex items-center gap-2 border-b border-pink-100 pb-3">
          <Sliders className="w-4 h-4" />
          <span>أنماط الحركة وسرعة التمرير والتفاعل</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">نمط عرض الشريط</label>
            <select
              value={currentSettings.mode}
              onChange={(e) => updateSettings({ mode: e.target.value as AnnouncementMode })}
              className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E] focus:outline-hidden focus:border-[#AD647D]"
            >
              <option value="marquee">تمرير أفقي مستمر (Marquee)</option>
              <option value="slideshow">تتابع الرسائل بفاصل زمني (Slideshow)</option>
              <option value="static">ثابت بدون حركة (Static)</option>
            </select>
            <p className="text-[10px] text-gray-400">طريقة انتقال وعرض الإعلانات للزوار</p>
          </div>

          {/* Speed Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">سرعة الحركة (للتمرير)</label>
            <select
              value={currentSettings.speed}
              disabled={currentSettings.mode !== 'marquee'}
              onChange={(e) => updateSettings({ speed: e.target.value as AnnouncementSpeed })}
              className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E] disabled:opacity-50 focus:outline-hidden focus:border-[#AD647D]"
            >
              <option value="slow">حركة هادئة بطيئة (40 ثانية)</option>
              <option value="normal">حركة متزنة قياسية (24 ثانية)</option>
              <option value="fast">حركة سريعة (14 ثانية)</option>
            </select>
            <p className="text-[10px] text-gray-400">سرعة انسياب شريط Marquee</p>
          </div>

          {/* Duration Selector for Slideshow */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">مدة بقاء الرسالة (بالثواني)</label>
            <select
              value={currentSettings.durationSeconds}
              disabled={currentSettings.mode !== 'slideshow'}
              onChange={(e) => updateSettings({ durationSeconds: Number(e.target.value) })}
              className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E] disabled:opacity-50 focus:outline-hidden focus:border-[#AD647D]"
            >
              <option value="3">3 ثوانٍ لكل رسالة</option>
              <option value="5">5 ثوانٍ لكل رسالة (موصى به)</option>
              <option value="7">7 ثوانٍ لكل رسالة</option>
              <option value="10">10 ثوانٍ لكل رسالة</option>
            </select>
            <p className="text-[10px] text-gray-400">الفترة الزمنية بين كل إعلان والآخر</p>
          </div>

          {/* Direction */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">اتجاه الحركة</label>
            <select
              value={currentSettings.direction}
              disabled={currentSettings.mode !== 'marquee'}
              onChange={(e) => updateSettings({ direction: e.target.value as 'rtl' | 'ltr' })}
              className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E] disabled:opacity-50 focus:outline-hidden focus:border-[#AD647D]"
            >
              <option value="rtl">من اليمين إلى اليسار (عربي طبيعي)</option>
              <option value="ltr">من اليسار إلى اليمين</option>
            </select>
            <p className="text-[10px] text-gray-400">مسار تدفق النص في الشريط</p>
          </div>
        </div>

        {/* Toggles Strip */}
        <div className="pt-3 border-t border-pink-50 flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
            <input
              type="checkbox"
              checked={currentSettings.pauseOnHover}
              onChange={(e) => updateSettings({ pauseOnHover: e.target.checked })}
              className="w-4 h-4 rounded-md accent-[#AD647D]"
            />
            <span>إيقاف الحركة تلقائياً عند تمرير المؤشر (Pause on Hover)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
            <input
              type="checkbox"
              checked={currentSettings.closable}
              onChange={(e) => updateSettings({ closable: e.target.checked })}
              className="w-4 h-4 rounded-md accent-[#AD647D]"
            />
            <span>إتاحة زر إغلاق للشريط (Dismissible X)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
            <input
              type="checkbox"
              checked={currentSettings.showIcon}
              onChange={(e) => updateSettings({ showIcon: e.target.checked })}
              className="w-4 h-4 rounded-md accent-[#AD647D]"
            />
            <span>إظهار أيقونة بجانب كل رسالة</span>
          </label>
        </div>
      </div>

      {/* SECTION 2: COLORS & THEMES */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-5">
        <h4 className="text-xs font-bold text-[#AD647D] flex items-center gap-2 border-b border-pink-100 pb-3">
          <Palette className="w-4 h-4" />
          <span>تخصيص الألوان والتدرج اللوني للهوية الفاخرة</span>
        </h4>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-700">أنماط ألوان فاخرة جاهزة</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {COLOR_PRESETS.map((preset, idx) => {
              const isSelected = currentSettings.bgColorStart === preset.start && currentSettings.bgColorEnd === preset.end;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateSettings({
                    bgColorStart: preset.start,
                    bgColorEnd: preset.end,
                    textColor: preset.text,
                    accentColor: preset.accent
                  })}
                  className={`p-2 rounded-2xl border text-right transition flex flex-col gap-2 ${
                    isSelected ? 'border-[#AD647D] ring-2 ring-[#AD647D]/30 bg-[#FFF5F8]' : 'border-gray-200 hover:border-[#AD647D]'
                  }`}
                >
                  <div 
                    style={{ background: `linear-gradient(135deg, ${preset.start}, ${preset.end})` }} 
                    className="w-full h-8 rounded-xl shadow-inner flex items-center justify-center text-[10px] font-bold"
                  >
                    <span style={{ color: preset.accent }}>✦ فلورا</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 truncate">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-pink-50">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">لون بداية التدرج</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentSettings.bgColorStart}
                onChange={(e) => updateSettings({ bgColorStart: e.target.value })}
                className="w-9 h-9 rounded-xl border border-[#F8DDE6] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentSettings.bgColorStart}
                onChange={(e) => updateSettings({ bgColorStart: e.target.value })}
                className="flex-1 bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">لون نهاية التدرج</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentSettings.bgColorEnd}
                onChange={(e) => updateSettings({ bgColorEnd: e.target.value })}
                className="w-9 h-9 rounded-xl border border-[#F8DDE6] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentSettings.bgColorEnd}
                onChange={(e) => updateSettings({ bgColorEnd: e.target.value })}
                className="flex-1 bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">لون النص</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentSettings.textColor}
                onChange={(e) => updateSettings({ textColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-[#F8DDE6] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentSettings.textColor}
                onChange={(e) => updateSettings({ textColor: e.target.value })}
                className="flex-1 bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700">لون التمييز والأزرار</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentSettings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-[#F8DDE6] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentSettings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
                className="flex-1 bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2 text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MESSAGES MANAGER */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div>
            <h4 className="text-xs font-bold text-[#AD647D] flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>إدارة الرسائل والإعلانات الترويجية ({currentSettings.messages.length})</span>
            </h4>
            <p className="text-[11px] text-gray-400">يمكنك إضافة عدة رسائل، تفعيلها أو تعطيلها، وربطها بروابط أو كوبونات</p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewMessageModal}
            className="py-2 px-4 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة رسالة جديدة</span>
          </button>
        </div>

        {/* Message Items List */}
        <div className="space-y-2.5">
          {currentSettings.messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                msg.isActive 
                  ? 'bg-[#FFFDFD] border-[#F8DDE6] hover:border-[#AD647D]' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              {/* Message Details */}
              <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#AD647D] flex items-center justify-center shrink-0">
                  {renderIcon(msg.icon, 'w-4 h-4')}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {msg.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#AD647D]/10 text-[#AD647D] border border-[#AD647D]/20">
                        {msg.badge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#2D141E] truncate">
                      {msg.text}
                    </span>
                  </div>

                  {/* Link / CTA Info */}
                  {msg.linkType && msg.linkType !== 'none' && (
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Link2 className="w-3 h-3 text-[#C9A46A]" />
                      <span>
                        {msg.linkType === 'coupon' && `ينسخ كود الكوبون: [${msg.linkValue}]`}
                        {msg.linkType === 'product' && `يفتح تفاصيل المنتج: [${msg.linkValue}]`}
                        {msg.linkType === 'category' && `ينتقل للتصنيف: [${msg.linkValue}]`}
                        {msg.linkType === 'page' && `ينتقل لصفحة: [${msg.linkValue}]`}
                        {msg.linkType === 'custom' && `رابط مخصص: ${msg.linkValue}`}
                      </span>
                      {msg.linkText && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 rounded-md font-bold">
                          زر: {msg.linkText}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {/* Active Toggle */}
                <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={msg.isActive}
                    onChange={() => handleToggleMessageActive(msg.id)}
                    className="accent-[#AD647D] w-3.5 h-3.5"
                  />
                  <span className="text-[11px] font-bold">{msg.isActive ? 'مفعلة' : 'معطلة'}</span>
                </label>

                <div className="h-4 w-[1px] bg-pink-100 mx-1"></div>

                {/* Move Up / Down */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveMessage(index, 'up')}
                  className="p-1.5 text-gray-400 hover:text-[#AD647D] disabled:opacity-30 rounded-lg hover:bg-pink-50"
                  title="تحريك لأعلى"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === currentSettings.messages.length - 1}
                  onClick={() => handleMoveMessage(index, 'down')}
                  className="p-1.5 text-gray-400 hover:text-[#AD647D] disabled:opacity-30 rounded-lg hover:bg-pink-50"
                  title="تحريك لأسفل"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEditMessageModal(msg)}
                  className="p-1.5 text-gray-600 hover:text-[#AD647D] hover:bg-pink-50 rounded-lg transition"
                  title="تعديل الرسالة"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="حذف الرسالة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT / CREATE MESSAGE MODAL */}
      {isModalOpen && editingMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveMessageModal}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#F8DDE6] animate-fadeIn text-right"
          >
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="text-sm font-bold text-[#2D141E] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#AD647D]" />
                <span>إعداد نص الرسالة الإعلانية والإجراء</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Announcement Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">نص الإعلان *</label>
              <textarea
                required
                rows={2}
                value={editingMessage.text}
                onChange={(e) => setEditingMessage({ ...editingMessage, text: e.target.value })}
                placeholder="مثال: خصم 10% بمناسبة عيد الفطر على جميع الباقات الفاخرة"
                className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-3 text-xs text-[#2D141E] focus:outline-hidden focus:border-[#AD647D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Badge */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">الشارة الترويجية (Badge اختياري)</label>
                <input
                  type="text"
                  value={editingMessage.badge || ''}
                  onChange={(e) => setEditingMessage({ ...editingMessage, badge: e.target.value })}
                  placeholder="مثال: عرض خاص، جديد، كود خصم"
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                />
              </div>

              {/* Icon Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">الأيقونة المرافقة</label>
                <select
                  value={editingMessage.icon || 'sparkles'}
                  onChange={(e) => setEditingMessage({ ...editingMessage, icon: e.target.value as AnnouncementIconType })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                >
                  <option value="sparkles">✨ بريق وورود (Sparkles)</option>
                  <option value="gift">🎁 هدية فاخرة (Gift)</option>
                  <option value="tag">🏷️ كود خصم وتوفير (Tag)</option>
                  <option value="truck">🚚 سيارة شحن وتوصيل (Truck)</option>
                  <option value="heart">💖 قلب ومشاعر (Heart)</option>
                  <option value="bell">🔔 تنبيه وإعلان (Bell)</option>
                  <option value="phone">📞 هاتف وتواصل (Phone)</option>
                </select>
              </div>
            </div>

            {/* Action / Link Type */}
            <div className="space-y-3 pt-3 border-t border-pink-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">نوع الإجراء أو الرابط عند النقر</label>
                <select
                  value={editingMessage.linkType || 'none'}
                  onChange={(e) => setEditingMessage({ 
                    ...editingMessage, 
                    linkType: e.target.value as AnnouncementLinkType,
                    linkValue: e.target.value === 'none' ? '' : editingMessage.linkValue
                  })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                >
                  <option value="none">بدون رابط (عرض نص الإعلان فقط)</option>
                  <option value="coupon">📋 نسخ كود كوبون خصم (Copy Coupon)</option>
                  <option value="category">🌸 الانتقال لتصنيف معين في المتجر</option>
                  <option value="product">🌹 فتح تفاصيل منتج معين</option>
                  <option value="page">📄 الانتقال لصفحة (من نحن، سياسة التوصيل، تواصل معنا)</option>
                  <option value="custom">🔗 رابط مخصص (واتساب، رابط خارجي)</option>
                </select>
              </div>

              {/* Conditional Link Target Inputs */}
              {editingMessage.linkType === 'coupon' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">اختر الكوبون أو اكتب كوده</label>
                  <div className="flex gap-2">
                    <select
                      value={editingMessage.linkValue || ''}
                      onChange={(e) => setEditingMessage({ ...editingMessage, linkValue: e.target.value })}
                      className="flex-1 bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                    >
                      <option value="">-- اختر من كوبونات المتجر --</option>
                      {coupons.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} ر.س`})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="أو اكتب الكود يدوياً"
                      value={editingMessage.linkValue || ''}
                      onChange={(e) => setEditingMessage({ ...editingMessage, linkValue: e.target.value.toUpperCase() })}
                      className="w-40 bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              {editingMessage.linkType === 'category' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">اختر التصنيف المستهدف</label>
                  <select
                    value={editingMessage.linkValue || ''}
                    onChange={(e) => setEditingMessage({ ...editingMessage, linkValue: e.target.value })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                  >
                    <option value="">-- اختر التصنيف --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingMessage.linkType === 'product' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">اختر المنتج المستهدف</label>
                  <select
                    value={editingMessage.linkValue || ''}
                    onChange={(e) => setEditingMessage({ ...editingMessage, linkValue: e.target.value })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                  >
                    <option value="">-- اختر المنتج من الكتالوج --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.price} ر.س)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingMessage.linkType === 'page' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">اختر صفحة المتجر</label>
                  <select
                    value={editingMessage.linkValue || ''}
                    onChange={(e) => setEditingMessage({ ...editingMessage, linkValue: e.target.value })}
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                  >
                    <option value="policy">سياسة الشحن والتوصيل (من يومين إلى 5 أيام بمكة)</option>
                    <option value="about">من نحن - قصة Flora Faten</option>
                    <option value="contact">تواصل معنا والدعم</option>
                    <option value="products">كتالوج كافة المنتجات</option>
                    <option value="tracking">تتبع مسار الطلب</option>
                  </select>
                </div>
              )}

              {editingMessage.linkType === 'custom' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">الرابط المخصص</label>
                  <input
                    type="text"
                    value={editingMessage.linkValue || ''}
                    onChange={(e) => setEditingMessage({ ...editingMessage, linkValue: e.target.value })}
                    placeholder="https://wa.me/966501234567 أو أي رابط خارجي"
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E] dir-ltr text-left"
                  />
                </div>
              )}

              {/* Link Text / Button Label */}
              {editingMessage.linkType && editingMessage.linkType !== 'none' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">نص الزر الصغير (Button Text)</label>
                  <input
                    type="text"
                    value={editingMessage.linkText || ''}
                    onChange={(e) => setEditingMessage({ ...editingMessage, linkText: e.target.value })}
                    placeholder="مثال: تسوق الآن، نسخ الكوبون، تصفح الباقات"
                    className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs text-[#2D141E]"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-pink-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                حفظ الرسالة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
