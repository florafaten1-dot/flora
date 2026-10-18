import React from 'react';
import { Flower2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  fallbackIconClassName?: string;
  showText?: boolean;
  textSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  subtitle?: string | boolean;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  imageClassName = 'w-11 h-11',
  fallbackIconClassName = 'w-6 h-6 text-[#AD647D]',
  showText = true,
  textSize = '2xl',
  subtitle = true,
  alt = 'Flora Faten | فلورا فاتن'
}) => {
  const { settings } = useStore();
  const [imgError, setImgError] = React.useState(false);

  // Reset imgError if logoUrl updates
  React.useEffect(() => {
    setImgError(false);
  }, [settings.logoUrl]);

  const hasCustomLogo = Boolean(settings.logoUrl && !imgError);

  const textSizeClasses = {
    sm: 'text-base',
    base: 'text-lg',
    lg: 'text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none min-w-0 ${className}`}>
      {/* Icon or Image container */}
      <div 
        className={`${imageClassName} rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] flex items-center justify-center border-2 border-[#C9A46A] shadow-xs shrink-0 overflow-hidden relative`}
      >
        {hasCustomLogo ? (
          <img
            src={settings.logoUrl}
            alt={alt}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <Flower2 className={fallbackIconClassName} />
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-right min-w-0">
          <span 
            className={`${textSizeClasses[textSize]} font-bold font-serif-lux tracking-tight text-[#AD647D] transition leading-tight truncate`}
          >
            {settings.storeNameEn && settings.storeNameEn.includes('Flora Faten') ? (
              <>
                <span>Flora Faten</span>
                <span className="hidden lg:inline font-normal text-xs text-[#AD647D]/75 mr-1.5 font-sans">
                  {settings.storeNameEn.replace('Flora Faten', '').replace(/^[ -]+/, '')}
                </span>
              </>
            ) : (
              settings.storeNameEn || 'Flora Faten'
            )}
          </span>
          {subtitle && (
            <span className="text-[10px] sm:text-xs text-[#C9A46A] font-semibold tracking-wider sm:tracking-widest flex items-center gap-1 truncate">
              {typeof subtitle === 'string' ? (
                subtitle
              ) : (
                <>
                  <span>فلورا فاتن</span>
                  <span className="hidden sm:inline text-[10px] opacity-75">بوتيك الورود والهدايا</span>
                </>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
