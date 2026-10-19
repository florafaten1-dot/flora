/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { ProductsCatalogView } from './components/products/ProductsCatalogView';
import { ProductModal } from './components/products/ProductModal';
import { ProductCompareModal } from './components/products/ProductCompareModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserAccountView } from './components/account/UserAccountView';
import { AffiliatePortalView } from './components/affiliate/AffiliatePortalView';
import { WishlistView } from './components/wishlist/WishlistView';
import { 
  AboutView, 
  ContactView, 
  PolicyView, 
  FAQView, 
  PrivacyPolicyView, 
  TermsView, 
  DeliveryReturnPolicyView 
} from './components/pages/StaticPages';
import { Product, Order } from './types';
import { Flower2, ShieldAlert, Sparkles, X, Scale } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isStaff, loadingData, products, activeReferralCode, compareList } = useStore();
  const [showReferralBanner, setShowReferralBanner] = useState(true);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Navigate helper
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    const found = products.find(p => p.id === productId);
    if (found) {
      setSelectedProductForModal(found);
    }
  };

  const handleOrderCompleted = (order: Order) => {
    // Keep checkout open on success view
  };

  // Determine current view component
  const renderCurrentView = () => {
    if (currentTab === 'home') {
      return (
        <HomeView
          onNavigate={handleNavigate}
          onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        />
      );
    }

    if (currentTab === 'products') {
      return (
        <ProductsCatalogView
          onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        />
      );
    }

    if (currentTab.startsWith('cat_')) {
      const slug = currentTab.replace('cat_', '');
      return (
        <ProductsCatalogView
          initialCategory={slug}
          onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        />
      );
    }

    if (currentTab.startsWith('occ_')) {
      return (
        <ProductsCatalogView
          initialCategory={currentTab}
          onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        />
      );
    }

    if (currentTab === 'tracking') {
      return <OrderTrackingView />;
    }

    if (currentTab === 'wishlist') {
      return (
        <WishlistView
          onNavigate={handleNavigate}
          onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        />
      );
    }

    if (currentTab === 'account') {
      return <UserAccountView onNavigate={handleNavigate} />;
    }

    if (currentTab === 'affiliate') {
      return <AffiliatePortalView onNavigate={handleNavigate} />;
    }

    if (currentTab === 'admin') {
      if (!isStaff) {
        return (
          <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#F8DDE6] rounded-3xl text-center space-y-4 shadow-sm animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#2D141E]">لوحة التحكم محمية بصلاحيات الإدارة</h3>
            <p className="text-xs text-gray-500">
              يرجى تسجيل الدخول بحساب المسؤول المعتمد أو استخدام خيار الدخول التجريبي.
            </p>
            <button
              onClick={() => setCurrentTab('account')}
              className="py-2.5 px-6 bg-[#AD647D] text-white rounded-xl text-xs font-bold"
            >
              الانتقال لصفحة تسجيل الدخول
            </button>
          </div>
        );
      }
      return <AdminDashboard />;
    }

    if (currentTab === 'about') {
      return <AboutView />;
    }

    if (currentTab === 'contact') {
      return <ContactView />;
    }

    if (currentTab === 'faq') {
      return <FAQView />;
    }

    if (currentTab === 'privacy') {
      return <PrivacyPolicyView />;
    }

    if (currentTab === 'terms') {
      return <TermsView />;
    }

    if (currentTab === 'delivery-policy' || currentTab === 'policy') {
      return <DeliveryReturnPolicyView />;
    }

    return (
      <HomeView
        onNavigate={handleNavigate}
        onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        onSelectProduct={handleSelectProduct}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFFDFD] text-[#2D141E] w-full max-w-full overflow-x-hidden">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onSelectProduct={handleSelectProduct}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Floating Referral Welcome Banner */}
      {activeReferralCode && showReferralBanner && (
        <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE6ED] to-[#FFF0F4] border-b border-[#F8DDE6] px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-[#AD647D] flex items-center justify-between shadow-2xs animate-fadeIn w-full max-w-full">
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#C9A46A] animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs leading-relaxed truncate sm:whitespace-normal">
                أهلاً بك في Flora Faten! أنت تتسوق عبر ترشيح شريكنا (<strong className="font-mono text-[#2D141E]">{activeReferralCode}</strong>) — يتم احتساب الخصم والعمولة تلقائياً 🌸
              </span>
            </div>
            <button
              onClick={() => setShowReferralBanner(false)}
              className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
              aria-label="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-12 w-full max-w-full overflow-x-hidden">
        {loadingData ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border-2 border-[#E7A0B4] flex items-center justify-center animate-spin">
              <Flower2 className="w-8 h-8 text-[#AD647D]" />
            </div>
            <span className="text-xs font-bold text-[#AD647D] animate-pulse">
              جاري الاتصال بقاعدة بيانات Flora Faten السحابية...
            </span>
          </div>
        ) : (
          renderCurrentView()
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Product Customization & Order Modal */}
      {selectedProductForModal && (
        <ProductModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => {
          setIsCartOpen(false);
          setCurrentTab('products');
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Product Comparison Modal (Max 3 products) */}
      <ProductCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onOpenProductDetails={(product) => setSelectedProductForModal(product)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Floating Compare Button when items are in compare list */}
      {compareList.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-[#2D141E] via-[#4A2030] to-[#2D141E] text-white px-4 py-3 rounded-full shadow-2xl border border-[#C9A46A]/50 hover:border-[#C9A46A] flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 animate-fadeIn cursor-pointer"
          title="عرض جدول مقارنة الباقات"
        >
          <Scale className="w-4 h-4 text-[#C9A46A]" />
          <span className="text-xs font-bold">مقارنة الباقات</span>
          <span className="bg-[#C9A46A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {compareList.length}
          </span>
        </button>
      )}

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
