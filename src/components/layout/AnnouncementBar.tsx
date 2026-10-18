import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Gift, 
  Tag, 
  Truck, 
  Heart, 
  Bell, 
  Phone, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnnouncementItem, AnnouncementIconType } from '../../types';
import { DEFAULT_ANNOUNCEMENT_SETTINGS } from '../../lib/initialData';

interface AnnouncementBarProps {
  onNavigate?: (tab: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onNavigate,
  onSelectProduct
}) => {
  const { settings } = useStore();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('flora_announcement_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Merge settings with fallback
  const config = useMemo(() => {
    const raw = settings.announcementSettings || DEFAULT_ANNOUNCEMENT_SETTINGS;
    // Check if master toggle is on
    const isMasterActive = settings.announcementActive !== undefined 
      ? settings.announcementActive 
      : raw.enabled;

    return {
      enabled: isMasterActive && raw.enabled !== false,
      mode: raw.mode || 'marquee',
      speed: raw.speed || 'normal',
      durationSeconds: Math.max(2, raw.durationSeconds || 5),
      direction: raw.direction || 'rtl',
      pauseOnHover: raw.pauseOnHover !== false,
      closable: raw.closable !== false,
      showIcon: raw.showIcon !== false,
      bgColorStart: raw.bgColorStart || '#AD647D',
      bgColorEnd: raw.bgColorEnd || '#8C465F',
      textColor: raw.textColor || '#FFFFFF',
      accentColor: raw.accentColor || '#FFE680',
      messages: (raw.messages && raw.messages.length > 0) 
        ? raw.messages.filter(m => m.isActive)
        : (settings.announcementText ? [{
            id: 'legacy-msg',
            text: settings.announcementText,
            badge: 'فلورا فاتن',
            icon: 'sparkles' as AnnouncementIconType,
            isActive: true
          }] : DEFAULT_ANNOUNCEMENT_SETTINGS.messages.filter(m => m.isActive))
    };
  }, [settings.announcementSettings, settings.announcementActive, settings.announcementText]);

  const activeMessages = config.messages;

  // Slideshow auto-advance timer
  useEffect(() => {
    if (config.mode !== 'slideshow' || activeMessages.length <= 1 || isPaused || prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % activeMessages.length);
    }, config.durationSeconds * 1000);

    return () => clearInterval(interval);
  }, [config.mode, config.durationSeconds, activeMessages.length, isPaused, prefersReducedMotion]);

  // Handle dismiss
  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('flora_announcement_dismissed', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle action click
  const handleActionClick = (msg: AnnouncementItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!msg.linkType || msg.linkType === 'none' || !msg.linkValue) {
      return;
    }

    if (msg.linkType === 'coupon') {
      try {
        navigator.clipboard.writeText(msg.linkValue);
        setCopiedCode(msg.linkValue);
        setTimeout(() => setCopiedCode(null), 3000);
      } catch {
        // Fallback
        setCopiedCode(msg.linkValue);
        setTimeout(() => setCopiedCode(null), 3000);
      }
      return;
    }

    if (msg.linkType === 'product' && onSelectProduct) {
      onSelectProduct(msg.linkValue);
      return;
    }

    if (msg.linkType === 'category' && onNavigate) {
      onNavigate(`cat_${msg.linkValue}`);
      return;
    }

    if (msg.linkType === 'page' && onNavigate) {
      onNavigate(msg.linkValue);
      return;
    }

    if (msg.linkType === 'custom') {
      if (msg.linkValue.startsWith('http://') || msg.linkValue.startsWith('https://')) {
        window.open(msg.linkValue, '_blank', 'noopener,noreferrer');
      } else if (msg.linkValue.startsWith('tel:') || msg.linkValue.startsWith('mailto:')) {
        window.location.href = msg.linkValue;
      } else if (onNavigate) {
        onNavigate(msg.linkValue);
      }
    }
  };

  // Render Icon helper
  const renderIcon = (type?: AnnouncementIconType, className: string = 'w-3.5 h-3.5') => {
    switch (type) {
      case 'gift':
        return <Gift className={className} />;
      case 'tag':
        return <Tag className={className} />;
      case 'truck':
        return <Truck className={className} />;
      case 'heart':
        return <Heart className={className} />;
      case 'bell':
        return <Bell className={className} />;
      case 'phone':
        return <Phone className={className} />;
      case 'sparkles':
      default:
        return <Sparkles className={`${className} animate-pulse`} />;
    }
  };

  // If disabled, dismissed, or no messages
  if (!config.enabled || isDismissed || activeMessages.length === 0) {
    return null;
  }

  // Calculate marquee speed in seconds
  const marqueeDurationMap: Record<string, string> = {
    slow: '40s',
    normal: '24s',
    fast: '14s'
  };
  const durationStyle = {
    '--marquee-duration': marqueeDurationMap[config.speed] || '24s'
  } as React.CSSProperties;

  // Single Item renderer
  const renderItemContent = (msg: AnnouncementItem, isLoop = false, loopKey = '') => {
    const isCopied = copiedCode === msg.linkValue;
    return (
      <div 
        key={loopKey ? `${msg.id}-${loopKey}` : msg.id}
        className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 shrink-0 transition-opacity select-none"
      >
        {/* Optional Icon */}
        {config.showIcon && (
          <span 
            style={{ color: config.accentColor }} 
            className="shrink-0 flex items-center justify-center filter drop-shadow-xs"
          >
            {renderIcon(msg.icon)}
          </span>
        )}

        {/* Optional Badge */}
        {msg.badge && (
          <span 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderColor: 'rgba(255, 255, 255, 0.35)',
              color: config.textColor
            }}
            className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs shrink-0 whitespace-nowrap"
          >
            {msg.badge}
          </span>
        )}

        {/* Message Text */}
        <span 
          style={{ color: config.textColor }} 
          className="text-[11px] sm:text-xs font-medium tracking-wide whitespace-nowrap"
        >
          {msg.text}
        </span>

        {/* Optional Action / Link Button */}
        {msg.linkType && msg.linkType !== 'none' && msg.linkValue && (
          <button
            type="button"
            onClick={(e) => handleActionClick(msg, e)}
            style={{ 
              backgroundColor: config.accentColor,
              color: '#3A1422'
            }}
            className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
            title={msg.linkText || 'انتقال'}
          >
            {msg.linkType === 'coupon' ? (
              isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5" />
                  <span>{msg.linkText || `نسخ ${msg.linkValue}`}</span>
                </>
              )
            ) : msg.linkType === 'custom' && msg.linkValue.startsWith('http') ? (
              <>
                <span>{msg.linkText || 'زيارة'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </>
            ) : (
              <>
                <span>{msg.linkText || 'اكتشف المزيد'}</span>
                <ArrowLeft className="w-2.5 h-2.5" />
              </>
            )}
          </button>
        )}

        {/* Separator for marquee items */}
        {isLoop && (
          <span className="opacity-40 text-xs px-2 select-none" style={{ color: config.accentColor }}>
            ✦
          </span>
        )}
      </div>
    );
  };

  const isMarquee = config.mode === 'marquee' && !prefersReducedMotion;
  const isSlideshow = config.mode === 'slideshow' && !prefersReducedMotion;

  return (
    <div
      role="region"
      aria-label="شريط الإعلانات الترويجي"
      dir="rtl"
      onMouseEnter={() => config.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => config.pauseOnHover && setIsPaused(false)}
      onFocus={() => config.pauseOnHover && setIsPaused(true)}
      onBlur={() => config.pauseOnHover && setIsPaused(false)}
      style={{
        background: `linear-gradient(135deg, ${config.bgColorStart} 0%, ${config.bgColorEnd} 100%)`,
        ...durationStyle
      }}
      className="relative z-40 w-full max-w-full overflow-hidden overflow-x-clip min-h-[38px] sm:min-h-[40px] flex items-center shadow-xs border-b border-black/5 min-w-0"
    >
      {/* Toast popup when coupon is copied */}
      {copiedCode && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-60 bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-fadeIn max-w-[90%] text-center pointer-events-none">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">تم نسخ الكوبون ({copiedCode}) بنجاح! 🌸</span>
        </div>
      )}

      {/* Marquee Mode */}
      {isMarquee && (
        <div 
          className={`announcement-marquee-container flex-1 min-w-0 w-full max-w-full flex items-center py-2 ${
            config.closable ? 'pl-8 pr-3 sm:pl-10 sm:pr-4' : 'px-3 sm:px-4'
          }`}
          style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
        >
          <div 
            className={`flex items-center shrink-0 ${
              config.direction === 'ltr' ? 'announcement-marquee-ltr' : 'announcement-marquee-rtl'
            } ${config.pauseOnHover ? 'announcement-pause-hover' : ''}`}
          >
            {/* Repeat list 2 times for seamless 50% translation loop */}
            {[0, 1].map((loopIdx) => (
              <div key={loopIdx} className="flex items-center shrink-0">
                {activeMessages.map((msg) => renderItemContent(msg, true, `loop-${loopIdx}`))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slideshow Mode */}
      {isSlideshow && (
        <div 
          className={`w-full max-w-full min-w-0 flex items-center justify-center py-2 relative overflow-hidden ${
            config.closable ? 'pl-10 pr-6 sm:pl-12 sm:pr-8' : 'px-4'
          }`}
        >
          {/* Previous Slide Button */}
          {activeMessages.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveSlideIndex(prev => (prev - 1 + activeMessages.length) % activeMessages.length)}
              style={{ color: config.textColor }}
              className="flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-white/15 active:scale-90 transition opacity-80 hover:opacity-100 cursor-pointer z-10"
              aria-label="الرسالة السابقة"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Current Slide Content with smooth transition */}
          <div className="flex items-center justify-center text-center overflow-hidden max-w-full">
            <div 
              key={activeSlideIndex}
              className="animate-fadeIn transition-all duration-300 flex items-center justify-center"
            >
              {renderItemContent(activeMessages[activeSlideIndex])}
            </div>
          </div>

          {/* Next Slide Button */}
          {activeMessages.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveSlideIndex(prev => (prev + 1) % activeMessages.length)}
              style={{ color: config.textColor }}
              className="flex absolute left-7 sm:left-9 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-white/15 active:scale-90 transition opacity-80 hover:opacity-100 cursor-pointer z-10"
              aria-label="الرسالة التالية"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Slide Indicator Dots if multiple */}
          {activeMessages.length > 1 && (
            <div className="hidden lg:flex items-center gap-1 absolute left-16 top-1/2 -translate-y-1/2 opacity-70">
              {activeMessages.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveSlideIndex(dotIdx)}
                  style={{
                    backgroundColor: dotIdx === activeSlideIndex ? config.accentColor : 'rgba(255, 255, 255, 0.4)'
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    dotIdx === activeSlideIndex ? 'w-4' : 'w-1.5'
                  }`}
                  aria-label={`الانتقال للإعلان ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Static Mode / Reduced Motion fallback */}
      {(!isMarquee && !isSlideshow) && (
        <div 
          className={`w-full max-w-full min-w-0 overflow-hidden flex items-center justify-center py-2 ${
            config.closable ? 'pl-8 pr-3 sm:pl-10 sm:pr-4' : 'px-3 sm:px-4'
          }`}
        >
          {renderItemContent(activeMessages[0])}
        </div>
      )}

      {/* Dismiss Button (Left side in RTL) */}
      {config.closable && (
        <button
          type="button"
          onClick={handleDismiss}
          style={{ color: config.textColor }}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 active:scale-90 transition opacity-80 hover:opacity-100 cursor-pointer shrink-0 z-20"
          title="إخفاء الإعلان مؤقتاً"
          aria-label="إغلاق شريط الإعلانات"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
