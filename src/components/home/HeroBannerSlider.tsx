import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  Sparkles, 
  Pause, 
  Play, 
  ExternalLink 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Banner } from '../../types';

interface HeroBannerSliderProps {
  onNavigate: (tab: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({
  onNavigate,
  onSelectProduct
}) => {
  const { activeBanners, bannerSliderSettings, language } = useStore();
  const isRtl = language !== 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const totalBanners = activeBanners.length;

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Safe navigation helpers (Circular)
  const goToNext = useCallback(() => {
    if (totalBanners <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  const goToPrev = useCallback(() => {
    if (totalBanners <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  }, [totalBanners]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (
      totalBanners <= 1 || 
      !bannerSliderSettings.autoPlay || 
      isPaused || 
      prefersReducedMotion || 
      isSwiping
    ) {
      return;
    }

    const intervalTime = Math.max(2, bannerSliderSettings.intervalSeconds || 3) * 1000;
    const timer = setInterval(() => {
      goToNext();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [totalBanners, bannerSliderSettings.autoPlay, bannerSliderSettings.intervalSeconds, isPaused, prefersReducedMotion, isSwiping, goToNext]);

  // Handle Touch Swipe (Mobile) - Does NOT block vertical scroll
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchDeltaX(0);
    setIsSwiping(false);
    if (bannerSliderSettings.pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStart.x;
    const diffY = touch.clientY - touchStart.y;

    // If horizontal movement is greater than vertical movement, track swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setTouchDeltaX(diffX);
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    if (touchStart && Math.abs(touchDeltaX) > 45) {
      // In RTL: dragging right (diffX > 0) goes to previous slide, dragging left (diffX < 0) goes to next slide
      if (touchDeltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    setTouchStart(null);
    setTouchDeltaX(0);
    setIsSwiping(false);
    if (bannerSliderSettings.pauseOnHover) {
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  // Click Handler for Banner
  const handleBannerClick = (banner: Banner) => {
    if (!banner.linkType || banner.linkType === 'none' || !banner.linkValue) {
      return;
    }

    if (banner.linkType === 'product' && onSelectProduct) {
      onSelectProduct(banner.linkValue);
      return;
    }

    if (banner.linkType === 'category') {
      const slug = banner.linkValue.startsWith('cat_') ? banner.linkValue : `cat_${banner.linkValue}`;
      onNavigate(slug);
      return;
    }

    if (banner.linkType === 'page') {
      onNavigate(banner.linkValue);
      return;
    }

    if (banner.linkType === 'custom') {
      if (banner.linkValue.startsWith('http://') || banner.linkValue.startsWith('https://')) {
        window.open(banner.linkValue, '_blank', 'noopener,noreferrer');
      } else {
        onNavigate(banner.linkValue);
      }
    }
  };

  // If no banners are active, render graceful luxury placeholder
  if (totalBanners === 0) {
    return (
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-6">
        <div className="w-full bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F4] to-[#FFF5F7] border border-[#F8DDE6] rounded-2xl sm:rounded-3xl p-8 text-center text-[#AD647D] shadow-xs">
          <Sparkles className="w-8 h-8 text-[#C9A46A] mx-auto mb-2 animate-pulse" />
          <h2 className="text-lg font-bold font-serif-lux text-[#2D141E]">Flora Faten Boutique | فلورا فاتن</h2>
          <p className="text-xs text-[#5D2B3D]/80 mt-1">أرقى باقات الورد والهدايا الفاخرة وتنسيقات المناسبات في مكة المكرمة</p>
        </div>
      </section>
    );
  }

  // Aspect ratio helper classes
  const aspectClass = "aspect-[16/9] sm:aspect-[21/9]";

  return (
    <section 
      aria-label="البنرات الترويجية الرئيسية"
      className="w-full max-w-full overflow-hidden pt-2 sm:pt-4 pb-4 sm:pb-8"
      onMouseEnter={() => bannerSliderSettings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => bannerSliderSettings.pauseOnHover && setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#F8DDE6] bg-[#FFF9FA] select-none group touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Slide Track */}
          <div className="relative w-full overflow-hidden">
            <div 
              className={`flex w-full ${
                bannerSliderSettings.transitionEffect === 'slide' 
                  ? 'transition-transform duration-500 ease-out' 
                  : 'transition-all duration-700 ease-in-out'
              }`}
              style={{
                transform: `translateX(${isRtl ? currentIndex * 100 : -currentIndex * 100}%)`,
              }}
            >
              {activeBanners.map((banner, index) => {
                const isCurrent = index === currentIndex;
                const hasClickAction = Boolean(banner.linkType && banner.linkType !== 'none' && banner.linkValue);

                return (
                  <div
                    key={banner.id}
                    className="w-full min-w-full shrink-0 relative overflow-hidden"
                    onClick={() => hasClickAction && handleBannerClick(banner)}
                    role={hasClickAction ? "button" : undefined}
                    tabIndex={hasClickAction ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (hasClickAction && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleBannerClick(banner);
                      }
                    }}
                    style={{ cursor: hasClickAction ? 'pointer' : 'default' }}
                  >
                    {/* Picture with responsive mobile & desktop source */}
                    <div className={`relative w-full ${aspectClass} overflow-hidden bg-gradient-to-tr from-[#FFF0F4] to-[#F8DDE6]`}>
                      <picture>
                        {banner.mobileImageUrl && (
                          <source 
                            media="(max-width: 640px)" 
                            srcSet={banner.mobileImageUrl} 
                          />
                        )}
                        <img
                          src={banner.imageUrl}
                          alt={banner.altText || banner.title}
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding="async"
                          {...(index === 0 ? { fetchPriority: "high" as const } : {})}
                          className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out pointer-events-none"
                          style={{ objectFit: banner.objectFit || 'cover' }}
                        />
                      </picture>

                      {/* Subtle Vignette Overlay for Text Legibility */}
                      {(banner.title || banner.subtitle || banner.buttonText) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-black/25 sm:to-transparent flex flex-col justify-end sm:justify-center p-4 sm:p-8 md:p-12 text-white text-right">
                          <div className="max-w-xl space-y-2 sm:space-y-3 animate-fadeIn">
                            {banner.title && (
                              <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black font-serif-lux leading-tight drop-shadow-md">
                                {banner.title}
                              </h2>
                            )}

                            {banner.subtitle && (
                              <p className="text-xs sm:text-sm md:text-base text-pink-100/90 line-clamp-2 max-w-lg drop-shadow-sm font-medium">
                                {banner.subtitle}
                              </p>
                            )}

                            {hasClickAction && (
                              <div className="pt-1.5 sm:pt-2">
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#AD647D] to-[#E7A0B4] text-white text-[11px] sm:text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all">
                                  <span>{banner.buttonText || 'اكتشف المزيد'}</span>
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows (Desktop & Tablet) */}
          {bannerSliderSettings.showArrows && totalBanners > 1 && (
            <>
              {/* Right Arrow (Previous in RTL) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#AD647D] backdrop-blur-md shadow-md flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer"
                aria-label="البنر السابق"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Left Arrow (Next in RTL) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#AD647D] backdrop-blur-md shadow-md flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer"
                aria-label="البنر التالي"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {bannerSliderSettings.showDots && totalBanners > 1 && (
            <div className="absolute bottom-2.5 sm:bottom-4 inset-x-0 flex items-center justify-center gap-1.5 sm:gap-2 z-20 pointer-events-none">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/25 backdrop-blur-md pointer-events-auto">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex 
                        ? 'w-6 bg-[#C9A46A] shadow-xs' 
                        : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`الانتقال إلى البنر ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Indicator Pill for Auto-Play / Active Counter */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-black/40 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 z-20 pointer-events-none">
            <span>{currentIndex + 1} / {totalBanners}</span>
            {isPaused && <Pause className="w-2.5 h-2.5 text-amber-300 animate-pulse" />}
          </div>
        </div>
      </div>
    </section>
  );
};
