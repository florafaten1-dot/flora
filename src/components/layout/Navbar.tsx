import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Compass, 
  LogOut,
  Flower2,
  Share2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import { AnnouncementBar } from './AnnouncementBar';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCart: () => void;
  onSelectProduct: (productId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCart,
  onSelectProduct,
  searchQuery,
  setSearchQuery
}) => {
  const { 
    settings, 
    cartTotalCount, 
    wishlist, 
    currentUser, 
    isAdmin, 
    isStaff, 
    isAffiliate,
    isDemoAdmin, 
    setDemoAdminMode, 
    logout,
    products,
    categories
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Filter products for live search preview
  const searchResults = searchQuery.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F8DDE6] shadow-xs">
      {/* Top Promotional Announcement Bar */}
      <AnnouncementBar 
        onNavigate={setCurrentTab}
        onSelectProduct={onSelectProduct}
      />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 w-full min-w-0">
          
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#AD647D] hover:bg-[#F8DDE6]/40 transition shrink-0"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Brand Identity */}
          <div 
            onClick={() => { setCurrentTab('home'); }} 
            className="cursor-pointer group select-none min-w-0 shrink"
          >
            <BrandLogo textSize="xl" imageClassName="w-9 h-9 sm:w-11 sm:h-11" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن باقة ورد، بوكس، بالون، شوكولاتة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-full py-2.5 pr-11 pl-4 text-sm text-[#4A2030] placeholder-[#AD647D]/50 focus:outline-hidden focus:border-[#E7A0B4] focus:ring-2 focus:ring-[#E7A0B4]/20 transition"
              />
              <Search className="w-4 h-4 text-[#AD647D] absolute right-4 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-3 text-xs text-[#AD647D] hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Popup */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-12 right-0 left-0 bg-white border border-[#F8DDE6] rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-2 border-b border-[#F8DDE6] bg-[#FFF9FA] text-xs font-medium text-[#AD647D] flex justify-between">
                  <span>نتائج البحث ({searchResults.length})</span>
                  <button 
                    onClick={() => {
                      setCurrentTab('products');
                      setShowSearchModal(false);
                    }}
                    className="text-[#C9A46A] hover:underline"
                  >
                    عرض الكل في المتجر
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-pink-50 max-h-80 overflow-y-auto">
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod.id);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-[#FFF4F7] cursor-pointer transition"
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-[#F8DDE6]"
                        />
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-[#2D141E]">{prod.name}</h4>
                          <span className="text-[11px] text-[#AD647D]">{prod.categoryName}</span>
                        </div>
                        <div className="text-left font-bold text-xs text-[#AD647D]">
                          {prod.salePrice ? prod.salePrice : prod.price} ر.س
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-gray-500">
                    لا توجد منتجات مطابقة للبحث "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger for Mobile & Tablet */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-full text-[#AD647D] hover:bg-[#F8DDE6]/40 transition"
              aria-label="بحث في المنتجات"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Tracking shortcut - Desktop only */}
            <button
              onClick={() => setCurrentTab('tracking')}
              title="تتبع طلبك"
              className={`hidden md:flex p-2.5 rounded-full transition items-center gap-1.5 text-xs font-medium ${
                currentTab === 'tracking'
                  ? 'bg-[#AD647D] text-white shadow-xs'
                  : 'text-[#AD647D] hover:bg-[#F8DDE6]/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>تتبع الطلب</span>
            </button>

            {/* Wishlist - Desktop/Tablet */}
            <button
              onClick={() => setCurrentTab('wishlist')}
              title="قائمة الرغبات"
              className={`hidden sm:flex relative p-2 sm:p-2.5 rounded-full transition ${
                currentTab === 'wishlist'
                  ? 'bg-[#AD647D] text-white'
                  : 'text-[#AD647D] hover:bg-[#F8DDE6]/40'
              }`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A46A] text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button - Always visible & prominent */}
            <button
              onClick={onOpenCart}
              className="relative bg-gradient-to-r from-[#E7A0B4] to-[#AD647D] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-xs hover:shadow-md transition active:scale-95 shrink-0"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold hidden md:inline">السلة</span>
              {cartTotalCount > 0 && (
                <span className="bg-white text-[#AD647D] text-[10px] sm:text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-4 text-center">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Affiliate Portal Button - Desktop only */}
            {isAffiliate && (
              <button
                onClick={() => setCurrentTab('affiliate')}
                className={`hidden md:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 border transition ${
                  currentTab === 'affiliate'
                    ? 'bg-[#AD647D] text-white border-[#AD647D] shadow-xs'
                    : 'bg-[#FFF0F4] text-[#AD647D] border-[#F8DDE6] hover:bg-[#AD647D] hover:text-white'
                }`}
                title="بوابة المسوق وصانع المحتوى"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C9A46A]" />
                <span>بوابة المسوق</span>
              </button>
            )}

            {/* Admin Dashboard Badge / Button - Desktop only */}
            {isStaff ? (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`hidden md:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 border transition ${
                  currentTab === 'admin'
                    ? 'bg-[#C9A46A] text-white border-[#C9A46A] shadow-xs'
                    : 'bg-[#FFF8E7] text-[#9A7432] border-[#C9A46A] hover:bg-[#C9A46A] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة الإدارة</span>
              </button>
            ) : null}

            {/* User Account Button - Desktop only */}
            <button
              onClick={() => setCurrentTab('account')}
              title="حسابي"
              className={`hidden md:flex p-2.5 rounded-full transition ${
                currentTab === 'account'
                  ? 'bg-[#AD647D] text-white'
                  : 'text-[#AD647D] hover:bg-[#F8DDE6]/40'
              }`}
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-6 py-2.5 border-t border-[#F8DDE6]/60 text-xs font-medium text-[#4A2030]">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-full transition ${
              currentTab === 'home'
                ? 'bg-[#E7A0B4] text-white font-bold'
                : 'hover:text-[#AD647D] hover:bg-[#FFF0F4]'
            }`}
          >
            الرئيسية
          </button>
          
          <button
            onClick={() => setCurrentTab('products')}
            className={`px-3 py-1.5 rounded-full transition ${
              currentTab === 'products'
                ? 'bg-[#E7A0B4] text-white font-bold'
                : 'hover:text-[#AD647D] hover:bg-[#FFF0F4]'
            }`}
          >
            جميع الباقات والمنتجات
          </button>

          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentTab(`cat_${cat.slug}`);
              }}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                currentTab === `cat_${cat.slug}`
                  ? 'bg-[#E7A0B4] text-white font-bold'
                  : 'hover:text-[#AD647D] hover:bg-[#FFF0F4]'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => setCurrentTab('affiliate')}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1 ${
              currentTab === 'affiliate'
                ? 'bg-[#E7A0B4] text-white font-bold'
                : 'hover:text-[#AD647D] hover:bg-[#FFF0F4]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#C9A46A]" />
            <span>التسويق بالعمولة</span>
          </button>

          <button
            onClick={() => setCurrentTab('about')}
            className={`px-3 py-1.5 rounded-full transition ${
              currentTab === 'about'
                ? 'bg-[#E7A0B4] text-white font-bold'
                : 'hover:text-[#AD647D] hover:bg-[#FFF0F4]'
            }`}
          >
            من نحن
          </button>

          <button
            onClick={() => setCurrentTab('contact')}
            className={`px-3 py-1.5 rounded-full transition ${
              currentTab === 'contact'
                ? 'bg-[#E7A0B4] text-white font-bold'
                : 'hover:text-[#AD647D] hover:bg-[#FFF0F4]'
            }`}
          >
            اتصل بنا
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F8DDE6] px-4 py-4 space-y-2 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2 pb-3 border-b border-pink-100">
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 pr-9 pl-3 text-sm"
            />
            <Search className="w-4 h-4 text-[#AD647D] absolute right-7" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-right rounded-xl text-xs font-semibold ${
                currentTab === 'home' ? 'bg-[#E7A0B4] text-white' : 'bg-[#FFF9FA] text-[#4A2030]'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => { setCurrentTab('products'); setMobileMenuOpen(false); }}
              className={`p-2.5 text-right rounded-xl text-xs font-semibold ${
                currentTab === 'products' ? 'bg-[#E7A0B4] text-white' : 'bg-[#FFF9FA] text-[#4A2030]'
              }`}
            >
              جميع المنتجات
            </button>
          </div>

          <div className="text-[11px] font-bold text-[#AD647D] pt-2 px-1">التصنيفات</div>
          <div className="grid grid-cols-1 gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentTab(`cat_${cat.slug}`);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 text-right rounded-lg text-xs ${
                  currentTab === `cat_${cat.slug}` ? 'bg-[#F8DDE6] text-[#AD647D] font-bold' : 'hover:bg-pink-50'
                }`}
              >
                • {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-pink-100 flex flex-col gap-2">
            <button
              onClick={() => { setCurrentTab('tracking'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 bg-[#FFF4F7] text-[#AD647D] rounded-xl text-xs font-semibold text-right flex items-center justify-between"
            >
              <span>تتبع شحنتك وطلبك</span>
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setCurrentTab('affiliate'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 bg-[#FFF0F4] text-[#AD647D] border border-[#F8DDE6] rounded-xl text-xs font-bold text-right flex items-center justify-between"
            >
              <span>برنامج التسويق بالعمولة وصناع المحتوى</span>
              <Share2 className="w-4 h-4 text-[#C9A46A]" />
            </button>

            <button
              onClick={() => { setCurrentTab('account'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 bg-[#FFF4F7] text-[#AD647D] rounded-xl text-xs font-semibold text-right flex items-center justify-between"
            >
              <span>حسابي وطلباتي</span>
              <UserIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 bg-[#FFF8E7] text-[#9A7432] border border-[#C9A46A] rounded-xl text-xs font-bold text-right flex items-center justify-between"
            >
              <span>لوحة التحكم الإدارية</span>
              <ShieldCheck className="w-4 h-4 text-[#C9A46A]" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex flex-col justify-start pt-16">
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <span className="font-bold text-sm text-[#AD647D]">بحث في متجر فلورا فاتن</span>
              <button onClick={() => setShowSearchModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="mt-3 relative">
              <input
                type="text"
                autoFocus
                placeholder="اكتب اسم الباقة أو الهدية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF9FA] border border-[#E7A0B4] rounded-xl py-2.5 pr-9 pl-3 text-sm focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-[#AD647D] absolute right-3 top-3.5" />
            </div>

            {searchQuery && (
              <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-pink-50">
                {searchResults.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod.id);
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }}
                    className="py-2 flex items-center gap-3 cursor-pointer"
                  >
                    <img src={prod.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="text-xs font-bold">{prod.name}</div>
                      <div className="text-[11px] text-[#AD647D]">{prod.price} ر.س</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
