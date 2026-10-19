import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  getDoc
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  googleProvider, 
  SUPER_ADMIN_EMAIL, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  Product, 
  Category, 
  Order, 
  StoreSettings, 
  Coupon, 
  CartItem, 
  UserProfile, 
  UserRole,
  OrderStatus, 
  ProductSize, 
  ProductAddon,
  ProductReview,
  AffiliateProfile,
  PayoutRequest,
  AffiliateTransaction,
  Banner,
  BannerSliderSettings
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS, 
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  DEFAULT_ANNOUNCEMENT_SETTINGS,
  INITIAL_BANNERS,
  DEFAULT_BANNER_SLIDER_SETTINGS
} from '../lib/initialData';
import { isValidMakkahDeliveryDate } from '../lib/dateUtils';

// Initial sample affiliates to seed if empty
const INITIAL_AFFILIATES: AffiliateProfile[] = [
  {
    id: 'aff_fatima',
    userId: 'user_fatima_demo',
    name: 'فاطمة أحمد الشهري',
    email: 'fatima.creator@example.com',
    phone: '0551234567',
    status: 'approved',
    referralCode: 'FATIMA10',
    commissionType: 'percentage',
    commissionValue: 10, // 10% commission
    customerDiscountPercent: 10, // 10% discount for buyers
    totalClicks: 148,
    totalOrders: 19,
    totalSales: 4850,
    totalEarnings: 485,
    paidEarnings: 300,
    pendingBalance: 185,
    bankName: 'مصرف الراجحي',
    accountHolder: 'فاطمة أحمد الشهري',
    iban: 'SA4480000123608010123456',
    socialChannels: 'Snapchat: @fatima_flora / Instagram: @fatima.lifestyle',
    notes: 'صانعة محتوى مهتمة بتنسيق المناسبات والهدايا في منطقة مكة المكرمة',
    appliedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    approvedAt: new Date(Date.now() - 28 * 86400000).toISOString()
  },
  {
    id: 'aff_sarah',
    userId: 'user_sarah_demo',
    name: 'سارة الهذلي',
    email: 'sarah.makkah@example.com',
    phone: '0569876543',
    status: 'approved',
    referralCode: 'SARAH15',
    commissionType: 'percentage',
    commissionValue: 12,
    customerDiscountPercent: 15,
    totalClicks: 92,
    totalOrders: 11,
    totalSales: 3120,
    totalEarnings: 374,
    paidEarnings: 200,
    pendingBalance: 174,
    bankName: 'البنك الأهلي السعودي (SNB)',
    accountHolder: 'سارة الهذلي',
    iban: 'SA0310000001234567890123',
    socialChannels: 'TikTok: @sarah_gifts / X: @sarah_makkah',
    notes: 'تغطيات حفلات التخرج والزفاف في مكة المكرمة',
    appliedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    approvedAt: new Date(Date.now() - 18 * 86400000).toISOString()
  }
];

const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay_1',
    affiliateId: 'aff_fatima',
    affiliateName: 'فاطمة أحمد الشهري',
    affiliateEmail: 'fatima.creator@example.com',
    amount: 300,
    bankName: 'مصرف الراجحي',
    accountHolder: 'فاطمة أحمد الشهري',
    iban: 'SA4480000123608010123456',
    status: 'paid',
    requestedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    processedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    transactionReference: 'TRX-RAJ-8849201',
    adminNotes: 'تم التحويل لحساب الراجحي بنجاح'
  },
  {
    id: 'pay_2',
    affiliateId: 'aff_sarah',
    affiliateName: 'سارة الهذلي',
    affiliateEmail: 'sarah.makkah@example.com',
    amount: 200,
    bankName: 'البنك الأهلي السعودي (SNB)',
    accountHolder: 'سارة الهذلي',
    iban: 'SA0310000001234567890123',
    status: 'paid',
    requestedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    processedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    transactionReference: 'TRX-SNB-5510294',
    adminNotes: 'تم سداد المستحقات بالكامل'
  }
];

interface StoreContextType {
  // Auth
  currentUser: User | null;
  userProfile: UserProfile | null;
  isOwner: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isAffiliate: boolean;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  registerWithEmail: (email: string, pass: string, fullName: string, phone?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerificationLink: () => Promise<void>;
  logout: () => Promise<void>;
  setDemoAdminMode: (enable: boolean) => void;
  isDemoAdmin: boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;

  // Users management (for Owner & Admins)
  allUsers: UserProfile[];
  updateUserRole: (uid: string, role: UserRole, status?: 'active' | 'suspended') => Promise<void>;

  // Catalog & Banners
  products: Product[];
  categories: Category[];
  banners: Banner[];
  activeBanners: Banner[];
  settings: StoreSettings;
  bannerSliderSettings: BannerSliderSettings;
  addBanner: (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  reorderBanners: (orderedBanners: Banner[]) => Promise<void>;
  uploadBannerImage: (file: File) => Promise<string>;
  updateBannerSliderSettings: (settings: Partial<BannerSliderSettings>) => Promise<void>;

  // Language
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  coupons: Coupon[];
  orders: Order[];
  reviews: ProductReview[];
  getProductReviews: (productId: string) => ProductReview[];
  addProductReview: (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    userName: string;
    userEmail?: string;
  }) => Promise<void>;
  loadingData: boolean;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product, 
    quantity?: number, 
    selectedSize?: ProductSize, 
    selectedAddons?: ProductAddon[],
    giftCardMessage?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;

  // Product Comparison (Max 3 items)
  compareList: string[];
  addToCompare: (productId: string) => { success: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Best Sellers Helper
  getBestSellerProducts: (limit?: number) => Product[];

  // Checkout & Coupon & Affiliation
  appliedCoupon: Coupon | null;
  appliedAffiliate: AffiliateProfile | null;
  activeReferralCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<Order>;

  // Affiliate & Creators Program
  affiliates: AffiliateProfile[];
  payouts: PayoutRequest[];
  currentAffiliateProfile: AffiliateProfile | null;
  applyForAffiliate: (application: {
    name: string;
    phone: string;
    socialChannels: string;
    bankName?: string;
    accountHolder?: string;
    iban?: string;
    notes?: string;
  }) => Promise<void>;
  approveAffiliate: (
    affiliateId: string, 
    commissionType: 'percentage' | 'fixed', 
    commissionValue: number, 
    customerDiscountPercent: number, 
    referralCode: string
  ) => Promise<void>;
  rejectAffiliate: (affiliateId: string, notes?: string) => Promise<void>;
  updateAffiliate: (affiliateId: string, updates: Partial<AffiliateProfile>) => Promise<void>;
  requestPayout: (amount: number, bankName: string, accountHolder: string, iban: string) => Promise<void>;
  processPayout: (
    payoutId: string, 
    status: 'approved' | 'paid' | 'rejected', 
    notes?: string, 
    transactionRef?: string
  ) => Promise<void>;

  // Management (Admin)
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  saveProduct: (product: Partial<Product> & { name: string; price: number; category: string }) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  saveCategory: (category: Partial<Category> & { name: string; slug: string }) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveSettings: (newSettings: StoreSettings) => Promise<void>;
  uploadStoreLogo: (file: File) => Promise<string>;
  removeStoreLogo: () => Promise<void>;
  saveCoupon: (coupon: Partial<Coupon> & { code: string; discountValue: number }) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  deleteProductReview: (reviewId: string) => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;
  uploadCategoryImage: (file: File) => Promise<string>;
  clearAllMockImages: () => Promise<{ productsCleaned: number; categoriesCleaned: number; bannersCleaned: number }>;
  resetToInitialData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // Firestore Real-time Collections
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    try {
      return (localStorage.getItem('flora_lang') as 'ar' | 'en') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
    try {
      localStorage.setItem('flora_lang', next);
    } catch {}
  };
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);
  const [affiliates, setAffiliates] = useState<AffiliateProfile[]>(INITIAL_AFFILIATES);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUTS);
  const [loadingData, setLoadingData] = useState(true);

  // Referral tracking state
  const [activeReferralCode, setActiveReferralCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('flora_ref') || null;
    } catch {
      return null;
    }
  });
  const [appliedAffiliate, setAppliedAffiliate] = useState<AffiliateProfile | null>(null);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('florafaten_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('florafaten_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('florafaten_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('florafaten_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('florafaten_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('florafaten_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error(e);
    }
  }, [compareList]);

  // Check URL for referral parameter on mount: ?ref=CODE or ?aff=CODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref') || params.get('aff');
      if (refParam) {
        const code = refParam.trim().toUpperCase();
        setActiveReferralCode(code);
        localStorage.setItem('flora_ref', code);
        // Find affiliate and increment clicks in Firestore
        const affDocRef = doc(db, 'affiliates', code);
        getDoc(affDocRef).then((snap) => {
          if (snap.exists()) {
            const data = snap.data() as AffiliateProfile;
            updateDoc(affDocRef, {
              totalClicks: (data.totalClicks || 0) + 1
            }).catch(() => {});
          }
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Referral check error:', e);
    }
  }, []);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          const isSuper = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

          if (snap.exists()) {
            const existing = snap.data() as UserProfile;
            // Sync / merge wishlist between guest and user profile
            if (existing.wishlist && Array.isArray(existing.wishlist)) {
              setWishlist(prev => {
                const merged = Array.from(new Set([...existing.wishlist!, ...prev]));
                try {
                  localStorage.setItem('florafaten_wishlist', JSON.stringify(merged));
                } catch (e) {}
                if (merged.length !== existing.wishlist!.length) {
                  updateDoc(userDocRef, { wishlist: merged }).catch(console.warn);
                }
                return merged;
              });
            } else {
              // If user has no saved wishlist but guest has items, save them to profile
              setWishlist(prev => {
                if (prev.length > 0) {
                  updateDoc(userDocRef, { wishlist: prev }).catch(console.warn);
                }
                return prev;
              });
            }

            // Ensure super admin retains owner role
            if (isSuper && existing.role !== 'owner') {
              const updated: UserProfile = { ...existing, role: 'owner' };
              await setDoc(userDocRef, updated, { merge: true });
              setUserProfile(updated);
            } else {
              setUserProfile(existing);
            }
          } else {
            // Create user profile
            const currentGuestWishlist = (() => {
              try {
                const s = localStorage.getItem('florafaten_wishlist');
                return s ? JSON.parse(s) : [];
              } catch {
                return [];
              }
            })();

            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'عميل فلورا فاتن',
              phone: user.phoneNumber || '',
              role: isSuper ? 'owner' : 'customer',
              status: 'active',
              emailVerified: user.emailVerified,
              wishlist: currentGuestWishlist,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.warn('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initAndSubscribe = async () => {
      try {
        // 1. Settings
        const settingsRef = doc(db, 'storeSettings', 'general');
        const unsubSettings = onSnapshot(settingsRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as StoreSettings;
            // Build rich announcement settings with backward compatibility
            const announcementSettings = data.announcementSettings || {
              ...DEFAULT_ANNOUNCEMENT_SETTINGS,
              enabled: data.announcementActive !== undefined ? data.announcementActive : DEFAULT_ANNOUNCEMENT_SETTINGS.enabled,
              messages: data.announcementText ? [
                {
                  id: 'ann-init',
                  text: data.announcementText,
                  badge: 'فلورا فاتن',
                  icon: 'sparkles' as const,
                  isActive: true
                },
                ...DEFAULT_ANNOUNCEMENT_SETTINGS.messages.slice(1)
              ] : DEFAULT_ANNOUNCEMENT_SETTINGS.messages
            };

            const mergedSettings: StoreSettings = {
              ...INITIAL_SETTINGS,
              ...data,
              announcementSettings
            };

            // Only update address/cities in background if missing
            if (!data.address?.includes('الحمراء') || !data.address?.includes('مكة') || data.email !== 'floraf.aten1@gmail.com') {
              const updatedData: StoreSettings = {
                ...mergedSettings,
                address: INITIAL_SETTINGS.address,
                cities: (data.cities && data.cities.some(c => c.name.includes('الحمراء'))) ? data.cities : INITIAL_SETTINGS.cities,
              };
              setDoc(settingsRef, updatedData, { merge: true }).catch(err => console.warn('Settings sync:', err));
              setSettings(updatedData);
            } else {
              setSettings(mergedSettings);
            }
          } else {
            setDoc(settingsRef, INITIAL_SETTINGS).catch(err => console.warn('Settings seed:', err));
          }
        }, (err) => console.warn('Settings snapshot:', err));
        unsubs.push(unsubSettings);

        // 2. Categories
        const categoriesRef = collection(db, 'categories');
        const unsubCategories = onSnapshot(categoriesRef, async (querySnap) => {
          if (!querySnap.empty) {
            const catList: Category[] = [];
            querySnap.forEach((d) => {
              const data = d.data() as Category;
              const img = data.image?.includes('unsplash.com') ? '' : (data.image || '');
              catList.push({ ...data, id: d.id, image: img });
            });
            catList.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCategories(catList);
          } else {
            for (const cat of INITIAL_CATEGORIES) {
              setDoc(doc(db, 'categories', cat.id), cat).catch(err => console.warn('Cat seed:', err));
            }
          }
        }, (err) => console.warn('Categories snapshot:', err));
        unsubs.push(unsubCategories);

        // 3. Products
        const productsRef = collection(db, 'products');
        const unsubProducts = onSnapshot(productsRef, async (querySnap) => {
          if (!querySnap.empty) {
            const prodList: Product[] = [];
            querySnap.forEach((d) => {
              const data = d.data() as Product;
              const img = data.image?.includes('unsplash.com') ? '' : (data.image || '');
              const imgs = (data.images || []).filter(i => i && !i.includes('unsplash.com'));
              prodList.push({ ...data, id: d.id, image: img, images: imgs });
            });
            setProducts(prodList);
          } else {
            for (const prod of INITIAL_PRODUCTS) {
              setDoc(doc(db, 'products', prod.id), prod).catch(err => console.warn('Prod seed:', err));
            }
          }
          setLoadingData(false);
        }, (err) => {
          console.warn('Products snapshot:', err);
          setLoadingData(false);
        });
        unsubs.push(unsubProducts);

        // 4. Coupons
        const couponsRef = collection(db, 'coupons');
        const unsubCoupons = onSnapshot(couponsRef, async (querySnap) => {
          if (!querySnap.empty) {
            const coupList: Coupon[] = [];
            querySnap.forEach((d) => coupList.push({ ...d.data(), id: d.id } as Coupon));
            setCoupons(coupList);
          } else {
            for (const c of INITIAL_COUPONS) {
              setDoc(doc(db, 'coupons', c.id), c).catch(err => console.warn('Coup seed:', err));
            }
          }
        }, (err) => console.warn('Coupons snapshot:', err));
        unsubs.push(unsubCoupons);

        // 5. Orders (centralized live stream)
        const ordersRef = collection(db, 'orders');
        const unsubOrders = onSnapshot(ordersRef, (querySnap) => {
          const ordList: Order[] = [];
          querySnap.forEach((d) => ordList.push({ ...d.data(), id: d.id } as Order));
          ordList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(ordList);
        }, (err) => console.warn('Orders snapshot:', err));
        unsubs.push(unsubOrders);

        // 6. Affiliates (centralized live stream)
        const affiliatesRef = collection(db, 'affiliates');
        const unsubAffiliates = onSnapshot(affiliatesRef, async (querySnap) => {
          if (!querySnap.empty) {
            const affList: AffiliateProfile[] = [];
            querySnap.forEach((d) => affList.push({ ...d.data(), id: d.id } as AffiliateProfile));
            setAffiliates(affList);
          } else {
            for (const aff of INITIAL_AFFILIATES) {
              setDoc(doc(db, 'affiliates', aff.id), aff).catch(err => console.warn('Aff seed:', err));
            }
            setAffiliates(INITIAL_AFFILIATES);
          }
        }, (err) => console.warn('Affiliates snapshot:', err));
        unsubs.push(unsubAffiliates);

        // 7. Payouts (centralized live stream)
        const payoutsRef = collection(db, 'payouts');
        const unsubPayouts = onSnapshot(payoutsRef, async (querySnap) => {
          if (!querySnap.empty) {
            const payList: PayoutRequest[] = [];
            querySnap.forEach((d) => payList.push({ ...d.data(), id: d.id } as PayoutRequest));
            payList.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
            setPayouts(payList);
          } else {
            for (const p of INITIAL_PAYOUTS) {
              setDoc(doc(db, 'payouts', p.id), p).catch(err => console.warn('Payout seed:', err));
            }
            setPayouts(INITIAL_PAYOUTS);
          }
        }, (err) => console.warn('Payouts snapshot:', err));
        unsubs.push(unsubPayouts);

        // 8. Users collection (for Owner and Admin user management)
        const usersRef = collection(db, 'users');
        const unsubUsers = onSnapshot(usersRef, (querySnap) => {
          const uList: UserProfile[] = [];
          querySnap.forEach((d) => uList.push({ ...d.data(), uid: d.id } as UserProfile));
          setAllUsers(uList);
        }, (err) => console.warn('Users snapshot:', err));
        unsubs.push(unsubUsers);

        // 9. Reviews collection
        const reviewsRef = collection(db, 'reviews');
        const unsubReviews = onSnapshot(reviewsRef, async (querySnap) => {
          if (!querySnap.empty) {
            const revList: ProductReview[] = [];
            querySnap.forEach((d) => revList.push({ ...d.data(), id: d.id } as ProductReview));
            revList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReviews(revList);
          } else {
            for (const r of INITIAL_REVIEWS) {
              setDoc(doc(db, 'reviews', r.id), r).catch(err => console.warn('Review seed:', err));
            }
            setReviews(INITIAL_REVIEWS);
          }
        }, (err) => console.warn('Reviews snapshot:', err));
        unsubs.push(unsubReviews);

        // 10. Banners collection (centralized live stream)
        const bannersRef = collection(db, 'banners');
        const unsubBanners = onSnapshot(bannersRef, async (querySnap) => {
          if (!querySnap.empty) {
            const bList: Banner[] = [];
            querySnap.forEach((d) => {
              const data = d.data() as Banner;
              const img = data.imageUrl?.includes('unsplash.com') ? '' : (data.imageUrl || '');
              const mImg = data.mobileImageUrl?.includes('unsplash.com') ? '' : (data.mobileImageUrl || '');
              bList.push({ ...data, id: d.id, imageUrl: img, mobileImageUrl: mImg });
            });
            bList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setBanners(bList);
          } else {
            for (const b of INITIAL_BANNERS) {
              setDoc(doc(db, 'banners', b.id), b).catch(err => console.warn('Banner seed:', err));
            }
            setBanners(INITIAL_BANNERS);
          }
        }, (err) => console.warn('Banners snapshot:', err));
        unsubs.push(unsubBanners);

      } catch (err) {
        console.error('Firestore initialization error:', err);
        setLoadingData(false);
      }
    };

    initAndSubscribe();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  // Role resolution
  const isEmailSuperAdmin = currentUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const isOwner = isEmailSuperAdmin || userProfile?.role === 'owner';
  const isAdmin = isOwner || userProfile?.role === 'admin' || isDemoAdmin;
  const isStaff = isOwner || isAdmin || userProfile?.role === 'employee';

  // Current user's affiliate profile (matched by userId or email)
  const currentAffiliateProfile = React.useMemo(() => {
    if (!currentUser) return null;
    return affiliates.find(a => 
      a.userId === currentUser.uid || 
      (currentUser.email && a.email?.toLowerCase() === currentUser.email?.toLowerCase())
    ) || null;
  }, [currentUser, affiliates]);

  const isAffiliate = userProfile?.role === 'affiliate' || currentAffiliateProfile?.status === 'approved';

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const userDocRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userDocRef);
      const isSuper = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      
      if (!snap.exists()) {
        const newProf: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'عميل فلورا فاتن',
          phone: user.phoneNumber || '',
          role: isSuper ? 'owner' : 'customer',
          status: 'active',
          emailVerified: user.emailVerified,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProf);
        setUserProfile(newProf);
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  };

  // Email and Password Login
  const loginWithEmail = async (email: string, pass: string, rememberMe = true) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      const userDocRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      }
    } catch (error: any) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  // Register with Email and Password
  const registerWithEmail = async (email: string, pass: string, fullName: string, phone = '') => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      
      // Update display name in Firebase Auth
      await updateProfile(user, { displayName: fullName });

      // Create profile document
      const isSuper = email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      const newProf: UserProfile = {
        uid: user.uid,
        email: user.email || email.trim(),
        displayName: fullName,
        phone,
        role: isSuper ? 'owner' : 'customer',
        status: 'active',
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newProf);
      setUserProfile(newProf);

      // Send verification email
      try {
        await sendEmailVerification(user);
      } catch (e) {
        console.warn('Verification email sending error:', e);
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // Password Reset
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Send Email Verification
  const sendEmailVerificationLink = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (error: any) {
        console.error('Send email verification error:', error);
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsDemoAdmin(false);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign Out error:', error);
    }
  };

  const setDemoAdminMode = (enable: boolean) => {
    setIsDemoAdmin(enable);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const ref = doc(db, 'users', currentUser.uid);
      await updateDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  // Update user role (by Owner or Admin)
  const updateUserRole = async (uid: string, role: UserRole, status?: 'active' | 'suspended') => {
    try {
      const ref = doc(db, 'users', uid);
      const payload: any = { role };
      if (status) payload.status = status;
      await updateDoc(ref, payload);
      // update state
      setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, role, status: status || u.status } : u));
    } catch (err) {
      console.error('Update user role error:', err);
      throw err;
    }
  };

  // Cart operations
  const addToCart = (
    product: Product, 
    quantity = 1, 
    selectedSize?: ProductSize, 
    selectedAddons: ProductAddon[] = [],
    giftCardMessage?: string
  ) => {
    const variationKey = `${product.id}_${selectedSize?.id || 'standard'}_${selectedAddons.map(a => a.id).sort().join('-')}`;
    const basePrice = product.salePrice ?? product.price;
    const sizeDelta = selectedSize?.priceDelta || 0;
    const addonsDelta = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + sizeDelta + addonsDelta;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === variationKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
          giftCardMessage: giftCardMessage || updated[existingIndex].giftCardMessage
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: variationKey,
          product,
          quantity,
          selectedSize,
          selectedAddons,
          giftCardMessage,
          unitPrice,
          totalPrice: unitPrice * quantity
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setAppliedAffiliate(null);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Wishlist with Guest & Firebase User Synchronization
  const toggleWishlist = async (productId: string) => {
    const nextWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];

    setWishlist(nextWishlist);
    try {
      localStorage.setItem('florafaten_wishlist', JSON.stringify(nextWishlist));
    } catch (e) {
      console.warn('Local storage error for wishlist', e);
    }

    if (currentUser?.uid) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          wishlist: nextWishlist
        });
      } catch (err) {
        console.warn('Could not sync wishlist to Firestore for user', err);
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = async () => {
    setWishlist([]);
    try {
      localStorage.removeItem('florafaten_wishlist');
    } catch (e) {}

    if (currentUser?.uid) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          wishlist: []
        });
      } catch (err) {
        console.warn('Could not clear wishlist on Firestore:', err);
      }
    }
  };

  // Product Comparison System (Maximum 3 items)
  const addToCompare = (productId: string): { success: boolean; message: string } => {
    if (compareList.includes(productId)) {
      return { success: false, message: 'المنتج مضاف بالفعل إلى المقارنة' };
    }
    if (compareList.length >= 3) {
      return { success: false, message: 'يمكنك مقارنة 3 باقات كحد أقصى في المرة الواحدة' };
    }
    const updated = [...compareList, productId];
    setCompareList(updated);
    try {
      localStorage.setItem('florafaten_compare', JSON.stringify(updated));
    } catch (e) {}
    return { success: true, message: 'تمت إضافة الباقة إلى جدول المقارنة بنجاح ⚖️' };
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter(id => id !== productId);
    setCompareList(updated);
    try {
      localStorage.setItem('florafaten_compare', JSON.stringify(updated));
    } catch (e) {}
  };

  const clearCompare = () => {
    setCompareList([]);
    try {
      localStorage.removeItem('florafaten_compare');
    } catch (e) {}
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  // Best Sellers Helper: Computes real best sellers from completed orders without cancelled ones
  const getBestSellerProducts = useCallback((limit: number = 6): Product[] => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    if (completedOrders.length > 0) {
      const counts: Record<string, number> = {};
      for (const ord of completedOrders) {
        if (ord.items && Array.isArray(ord.items)) {
          for (const item of ord.items) {
            counts[item.productId] = (counts[item.productId] || 0) + item.quantity;
          }
        }
      }
      const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      const matched = sortedIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p));

      if (matched.length >= 2) {
        return matched.slice(0, limit);
      }
    }

    // High quality fallback: curated items flagged as isBestSeller or featured by boutique management
    const curated = products.filter(p => p.isBestSeller || p.featured);
    return (curated.length > 0 ? curated : products).slice(0, limit);
  }, [orders, products]);

  // Coupons & Affiliate attribution in cart
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();

    // 1. Check standard coupon catalog
    const standardCoupon = coupons.find(c => c.code.toUpperCase() === trimmed && c.isActive);
    if (standardCoupon) {
      if (cartSubtotal < standardCoupon.minOrderAmount) {
        return { 
          success: false, 
          message: `الحد الأدنى لاستخدام هذا الكود هو ${standardCoupon.minOrderAmount} ر.س` 
        };
      }
      setAppliedCoupon(standardCoupon);
      setAppliedAffiliate(null);
      return { success: true, message: `تم تفعيل كود الخصم بنجاح! 🎉` };
    }

    // 2. Check if code belongs to an approved affiliate
    const matchedAffiliate = affiliates.find(a => 
      a.referralCode?.toUpperCase() === trimmed && a.status === 'approved'
    );
    if (matchedAffiliate) {
      const discountPercent = matchedAffiliate.customerDiscountPercent || 10;
      const syntheticCoupon: Coupon = {
        id: `aff_coupon_${matchedAffiliate.id}`,
        code: matchedAffiliate.referralCode,
        discountType: 'percentage',
        discountValue: discountPercent,
        minOrderAmount: 50,
        isActive: true,
        usageCount: 0
      };
      setAppliedCoupon(syntheticCoupon);
      setAppliedAffiliate(matchedAffiliate);
      return { 
        success: true, 
        message: `تم تطبيق كود المسوق (${matchedAffiliate.name}) بخصم ${discountPercent}%! 🎉` 
      };
    }

    return { success: false, message: 'كود الخصم غير صالح أو منتهي الصلاحية' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setAppliedAffiliate(null);
  };

  // Order Creation (persisted in Firestore with Affiliate Attribution and strict verification)
  const createOrder = async (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    // 1. Validate delivery date in Makkah timezone (2 to 5 days strictly)
    if (!orderPayload.deliveryDate || !isValidMakkahDeliveryDate(orderPayload.deliveryDate)) {
      throw new Error('تاريخ التوصيل المختار غير صالح. وفق سياسة المتجر، يجب أن يكون موعد التوصيل بين يومين إلى 5 أيام من تاريخ الطلب بتوقيت مكة المكرمة.');
    }

    // 2. Validate items presence
    if (!orderPayload.items || orderPayload.items.length === 0) {
      throw new Error('سلة المشتريات فارغة. يرجى إضافة باقات إلى السلة قبل إتمام الطلب.');
    }

    // 3. Re-verify prices and stock against live store catalog
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of orderPayload.items) {
      const realProduct = products.find(p => p.id === item.productId);
      if (!realProduct) {
        throw new Error(`الباقة أو المنتج "${item.name}" لم يعد متاحاً في المتجر.`);
      }
      if (realProduct.stock !== undefined && realProduct.stock <= 0) {
        throw new Error(`عذراً، نفدت كمية المنتج "${realProduct.name}".`);
      }
      const basePrice = realProduct.salePrice ?? realProduct.price;
      const sizeDelta = item.selectedSize?.priceDelta || 0;
      const addonsDelta = (item.selectedAddons || []).reduce((acc, a) => acc + (a.price || 0), 0);
      const unitPrice = basePrice + sizeDelta + addonsDelta;
      const itemTotal = unitPrice * item.quantity;
      verifiedSubtotal += itemTotal;

      verifiedItems.push({
        ...item,
        name: realProduct.name,
        image: realProduct.image,
        unitPrice,
        itemTotal
      });
    }

    // 4. Delivery fee calculation from city settings
    const selectedCity = (settings.cities || []).find(c => c.name === orderPayload.deliveryCity);
    const rawDeliveryFee = selectedCity?.fee ?? settings.deliveryFeeDefault ?? 25;
    const isFreeDelivery = verifiedSubtotal >= (settings.freeDeliveryThreshold || 350);
    const verifiedDeliveryFee = isFreeDelivery ? 0 : rawDeliveryFee;

    // 5. Discount calculation
    let verifiedDiscount = 0;
    if (orderPayload.couponCode && appliedCoupon && appliedCoupon.code.toUpperCase() === orderPayload.couponCode.toUpperCase()) {
      if (verifiedSubtotal >= appliedCoupon.minOrderAmount) {
        if (appliedCoupon.discountType === 'percentage') {
          verifiedDiscount = Math.round((verifiedSubtotal * appliedCoupon.discountValue) / 100);
        } else {
          verifiedDiscount = appliedCoupon.discountValue;
        }
      }
    } else if (appliedAffiliate) {
      const pct = appliedAffiliate.customerDiscountPercent || 10;
      verifiedDiscount = Math.round((verifiedSubtotal * pct) / 100);
    }

    const verifiedTax = Math.round((verifiedSubtotal - verifiedDiscount) * 0.15 * 100) / 100;
    const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedDeliveryFee);

    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FF-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;
    const orderId = `order_${Date.now()}_${randomSuffix}`;

    // Determine affiliate attribution
    let affiliateForOrder = appliedAffiliate;
    if (!affiliateForOrder && activeReferralCode) {
      affiliateForOrder = affiliates.find(a => 
        a.referralCode?.toUpperCase() === activeReferralCode.toUpperCase() && a.status === 'approved'
      ) || null;
    }

    let calculatedCommission = 0;
    let affiliateCode: string | undefined = undefined;
    let affiliateId: string | undefined = undefined;

    if (affiliateForOrder) {
      affiliateCode = affiliateForOrder.referralCode;
      affiliateId = affiliateForOrder.id;
      if (affiliateForOrder.commissionType === 'percentage') {
        calculatedCommission = Math.round((verifiedSubtotal * (affiliateForOrder.commissionValue || 10)) / 100);
      } else {
        calculatedCommission = affiliateForOrder.commissionValue || 15;
      }
    }

    // Cash on Delivery ONLY per boutique policy
    const newOrder: Order = {
      ...orderPayload,
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      deliveryFee: verifiedDeliveryFee,
      discountAmount: verifiedDiscount,
      tax: verifiedTax,
      total: verifiedTotal,
      status: 'new',
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      id: orderId,
      orderNumber,
      affiliateCode,
      affiliateId,
      commissionAmount: calculatedCommission > 0 ? calculatedCommission : undefined,
      commissionStatus: calculatedCommission > 0 ? 'pending' : undefined,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);

      // Decrement stock in Firestore for ordered products
      for (const item of newOrder.items) {
        const prodRef = doc(db, 'products', item.productId);
        const prod = products.find(p => p.id === item.productId);
        if (prod && prod.stock > 0) {
          await updateDoc(prodRef, {
            stock: Math.max(0, prod.stock - item.quantity),
            updatedAt: timestamp
          }).catch(() => {});
        }
      }

      // If affiliate was attributed, update affiliate's stats and log transaction
      if (affiliateForOrder && calculatedCommission > 0) {
        const affDocRef = doc(db, 'affiliates', affiliateForOrder.id);
        await updateDoc(affDocRef, {
          totalOrders: (affiliateForOrder.totalOrders || 0) + 1,
          totalSales: (affiliateForOrder.totalSales || 0) + newOrder.total,
          totalEarnings: (affiliateForOrder.totalEarnings || 0) + calculatedCommission,
          pendingBalance: (affiliateForOrder.pendingBalance || 0) + calculatedCommission
        }).catch(err => console.warn('Affiliate stats update error:', err));

        // Create transaction entry
        const transId = `trans_${Date.now()}`;
        const transRecord: AffiliateTransaction = {
          id: transId,
          affiliateId: affiliateForOrder.id,
          orderId,
          orderNumber,
          orderTotal: newOrder.total,
          commissionAmount: calculatedCommission,
          status: 'pending',
          createdAt: timestamp
        };
        await setDoc(doc(db, 'affiliateTransactions', transId), transRecord).catch(() => {});
      }

      // Increment coupon usage if used
      if (appliedCoupon && !appliedAffiliate) {
        const couponRef = doc(db, 'coupons', appliedCoupon.id);
        await updateDoc(couponRef, {
          usageCount: (appliedCoupon.usageCount || 0) + 1
        }).catch(() => {});
      }

      clearCart();
      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
      throw error;
    }
  };

  // Affiliate Program Actions
  const applyForAffiliate = async (application: {
    name: string;
    phone: string;
    socialChannels: string;
    bankName?: string;
    accountHolder?: string;
    iban?: string;
    notes?: string;
  }) => {
    if (!currentUser) throw new Error('يرجى تسجيل الدخول أولاً لتقديم طلب الانضمام');
    const affId = `aff_${currentUser.uid}`;
    const timestamp = new Date().toISOString();
    // Generate suggested code from name
    const cleanName = application.name.split(' ')[0].replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '');
    const suggestedCode = `${cleanName || 'FATEN'}${Math.floor(10 + Math.random() * 90)}`.toUpperCase();

    const newAffiliate: AffiliateProfile = {
      id: affId,
      userId: currentUser.uid,
      name: application.name,
      email: currentUser.email || '',
      phone: application.phone,
      status: 'pending',
      referralCode: suggestedCode,
      commissionType: 'percentage',
      commissionValue: 10,
      customerDiscountPercent: 10,
      totalClicks: 0,
      totalOrders: 0,
      totalSales: 0,
      totalEarnings: 0,
      paidEarnings: 0,
      pendingBalance: 0,
      bankName: application.bankName || '',
      accountHolder: application.accountHolder || application.name,
      iban: application.iban || '',
      socialChannels: application.socialChannels,
      notes: application.notes || '',
      appliedAt: timestamp
    };

    try {
      await setDoc(doc(db, 'affiliates', affId), newAffiliate);
    } catch (err) {
      console.error('Apply for affiliate error:', err);
      throw err;
    }
  };

  const approveAffiliate = async (
    affiliateId: string, 
    commissionType: 'percentage' | 'fixed', 
    commissionValue: number, 
    customerDiscountPercent: number, 
    referralCode: string
  ) => {
    try {
      const affRef = doc(db, 'affiliates', affiliateId);
      const updates = {
        status: 'approved',
        commissionType,
        commissionValue: Number(commissionValue),
        customerDiscountPercent: Number(customerDiscountPercent),
        referralCode: referralCode.trim().toUpperCase(),
        approvedAt: new Date().toISOString()
      };
      await updateDoc(affRef, updates);

      // Find user and update their role to affiliate
      const aff = affiliates.find(a => a.id === affiliateId);
      if (aff && aff.userId) {
        await updateDoc(doc(db, 'users', aff.userId), {
          role: 'affiliate'
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Approve affiliate error:', err);
      throw err;
    }
  };

  const rejectAffiliate = async (affiliateId: string, notes?: string) => {
    try {
      const affRef = doc(db, 'affiliates', affiliateId);
      await updateDoc(affRef, {
        status: 'rejected',
        notes: notes || 'تم رفض الطلب من قبل الإدارة'
      });
    } catch (err) {
      console.error('Reject affiliate error:', err);
      throw err;
    }
  };

  const updateAffiliate = async (affiliateId: string, updates: Partial<AffiliateProfile>) => {
    try {
      const affRef = doc(db, 'affiliates', affiliateId);
      await updateDoc(affRef, updates);
    } catch (err) {
      console.error('Update affiliate error:', err);
      throw err;
    }
  };

  const requestPayout = async (amount: number, bankName: string, accountHolder: string, iban: string) => {
    if (!currentAffiliateProfile) throw new Error('لا يوجد حساب مسوق مرتبط');
    if (amount <= 0 || amount > (currentAffiliateProfile.pendingBalance || 0)) {
      throw new Error('المبلغ المطلوب غير متاح في رصيدك المعلق');
    }

    const payoutId = `payout_${Date.now()}`;
    const newPayout: PayoutRequest = {
      id: payoutId,
      affiliateId: currentAffiliateProfile.id,
      affiliateName: currentAffiliateProfile.name,
      affiliateEmail: currentAffiliateProfile.email,
      amount,
      bankName,
      accountHolder,
      iban,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'payouts', payoutId), newPayout);
    } catch (err) {
      console.error('Request payout error:', err);
      throw err;
    }
  };

  const processPayout = async (
    payoutId: string, 
    status: 'approved' | 'paid' | 'rejected', 
    notes?: string, 
    transactionRef?: string
  ) => {
    try {
      const pRef = doc(db, 'payouts', payoutId);
      const targetPayout = payouts.find(p => p.id === payoutId);
      const updates: any = {
        status,
        processedAt: new Date().toISOString(),
        adminNotes: notes || '',
        transactionReference: transactionRef || ''
      };
      await updateDoc(pRef, updates);

      // If marked as paid, deduct from affiliate's pending balance and add to paidEarnings
      if (status === 'paid' && targetPayout) {
        const aff = affiliates.find(a => a.id === targetPayout.affiliateId);
        if (aff) {
          const affDocRef = doc(db, 'affiliates', aff.id);
          await updateDoc(affDocRef, {
            pendingBalance: Math.max(0, (aff.pendingBalance || 0) - targetPayout.amount),
            paidEarnings: (aff.paidEarnings || 0) + targetPayout.amount
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Process payout error:', err);
      throw err;
    }
  };

  // Management functions
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const targetOrder = orders.find(o => o.id === orderId);

      const updates: any = {
        status,
        updatedAt: new Date().toISOString()
      };

      // If order is completed or paid, update affiliate commissionStatus to 'approved'
      if ((status === 'completed' || status === 'paid') && targetOrder?.affiliateId) {
        updates.commissionStatus = 'approved';
      } else if ((status === 'cancelled' || status === 'refunded') && targetOrder?.affiliateId) {
        updates.commissionStatus = 'cancelled';
      }

      await updateDoc(orderRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
      throw error;
    }
  };

  const saveProduct = async (productData: Partial<Product> & { name: string; price: number; category: string }) => {
    const isNew = !productData.id;
    const prodId = productData.id || `prod_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const cleanImg = (productData.image && !productData.image.includes('unsplash.com')) ? productData.image : '';
    const cleanImgs = (productData.images || []).filter(i => i && !i.includes('unsplash.com'));

    const fullProduct: Product = {
      id: prodId,
      name: productData.name,
      nameEn: productData.nameEn || '',
      description: productData.description || '',
      price: Number(productData.price),
      salePrice: productData.salePrice ? Number(productData.salePrice) : undefined,
      category: productData.category,
      categoryName: categories.find(c => c.slug === productData.category)?.name || 'عام',
      image: cleanImg,
      images: cleanImgs.length ? cleanImgs : (cleanImg ? [cleanImg] : []),
      stock: productData.stock !== undefined ? Number(productData.stock) : 10,
      featured: productData.featured ?? false,
      isBestSeller: productData.isBestSeller ?? false,
      isNew: productData.isNew ?? isNew,
      flowerType: productData.flowerType || 'natural',
      sizes: productData.sizes || [
        { id: 's1', name: 'الحجم القياسي', priceDelta: 0 },
        { id: 's2', name: 'الحجم الكبير الملكي', priceDelta: 80 }
      ],
      addons: productData.addons || [
        { id: 'a1', name: 'شوكولاتة بلجيكية فاخرة', price: 65, icon: '🍫' },
        { id: 'a2', name: 'بالون هيليوم مميز', price: 30, icon: '🎈' }
      ],
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      allowCardMessage: productData.allowCardMessage ?? true,
      createdAt: productData.createdAt || timestamp,
      updatedAt: timestamp
    };

    try {
      await setDoc(doc(db, 'products', prodId), fullProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${prodId}`);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
      throw error;
    }
  };

  const saveCategory = async (categoryData: Partial<Category> & { name: string; slug: string }) => {
    const catId = categoryData.id || `cat_${categoryData.slug}`;
    const cleanCatImg = (categoryData.image && !categoryData.image.includes('unsplash.com')) ? categoryData.image : '';
    const fullCategory: Category = {
      id: catId,
      name: categoryData.name,
      nameEn: categoryData.nameEn || '',
      slug: categoryData.slug,
      image: cleanCatImg,
      description: categoryData.description || '',
      order: categoryData.order || categories.length + 1
    };

    try {
      await setDoc(doc(db, 'categories', catId), fullCategory);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${catId}`);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${categoryId}`);
      throw error;
    }
  };

  const saveSettings = async (newSettings: StoreSettings) => {
    try {
      const announcementActive = newSettings.announcementSettings !== undefined
        ? newSettings.announcementSettings.enabled
        : (newSettings.announcementActive ?? true);
      
      const firstActiveMsg = newSettings.announcementSettings?.messages?.find(m => m.isActive)?.text;
      const announcementText = firstActiveMsg || newSettings.announcementText || INITIAL_SETTINGS.announcementText;

      const payload: StoreSettings = {
        ...newSettings,
        announcementActive,
        announcementText,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'storeSettings', 'general'), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'storeSettings/general');
      throw error;
    }
  };

  const uploadStoreLogo = async (file: File): Promise<string> => {
    // Generate safe storage path
    const extension = file.name.split('.').pop() || 'png';
    const filePath = `store/logo_${Date.now()}.${extension}`;
    const fileRef = storageRef(storage, filePath);

    try {
      // 1. Upload to Firebase Storage
      const snapshot = await uploadBytes(fileRef, file, {
        contentType: file.type || 'image/png',
        customMetadata: {
          uploadedBy: currentUser?.email || 'admin',
          app: 'Flora Faten Store'
        }
      });

      // 2. Obtain permanent download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // 3. Persist in central storeSettings document
      const updatedSettings: StoreSettings = {
        ...settings,
        logoUrl: downloadUrl,
        logoStoragePath: filePath,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'storeSettings', 'general'), updatedSettings);
      setSettings(updatedSettings);

      return downloadUrl;
    } catch (error) {
      console.error('Firebase Storage logo upload error:', error);
      throw error;
    }
  };

  const removeStoreLogo = async (): Promise<void> => {
    try {
      // If there's an existing storage path, attempt deletion from bucket
      if (settings.logoStoragePath) {
        try {
          const fileRef = storageRef(storage, settings.logoStoragePath);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.warn('Could not delete old logo from storage, proceeding with settings update:', storageErr);
        }
      }

      // Update settings document to remove logo
      const updatedSettings: StoreSettings = {
        ...settings,
        logoUrl: '',
        logoStoragePath: '',
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'storeSettings', 'general'), updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to remove store logo:', error);
      throw error;
    }
  };

  const saveCoupon = async (couponData: Partial<Coupon> & { code: string; discountValue: number }) => {
    const couponId = couponData.id || `coup_${Date.now()}`;
    const fullCoupon: Coupon = {
      id: couponId,
      code: couponData.code.toUpperCase(),
      discountType: couponData.discountType || 'percentage',
      discountValue: Number(couponData.discountValue),
      minOrderAmount: Number(couponData.minOrderAmount || 100),
      isActive: couponData.isActive ?? true,
      usageCount: couponData.usageCount || 0,
      expiresAt: couponData.expiresAt
    };

    try {
      await setDoc(doc(db, 'coupons', couponId), fullCoupon);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `coupons/${couponId}`);
      throw error;
    }
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `coupons/${couponId}`);
      throw error;
    }
  };

  const getProductReviews = (productId: string): ProductReview[] => {
    return reviews.filter(r => r.productId === productId);
  };

  const addProductReview = async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    userName: string;
    userEmail?: string;
  }) => {
    try {
      const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const cleanRating = Math.max(1, Math.min(5, Math.round(reviewData.rating)));

      // Check whether user or email has an actual completed order containing this product
      const targetEmail = (reviewData.userEmail || currentUser?.email || '').toLowerCase().trim();
      const hasCompletedPurchase = orders.some(ord => {
        if (ord.status !== 'completed') return false;
        const matchesUser = Boolean(
          (currentUser?.uid && ord.userId === currentUser.uid) ||
          (targetEmail && ord.customerEmail && ord.customerEmail.toLowerCase().trim() === targetEmail)
        );
        const hasItem = ord.items && Array.isArray(ord.items) && ord.items.some(item => item.productId === reviewData.productId);
        return matchesUser && hasItem;
      });

      const newReview: ProductReview = {
        id: reviewId,
        productId: reviewData.productId,
        userId: currentUser?.uid,
        userName: reviewData.userName.trim() || 'عميل فلورا فاتن',
        userEmail: reviewData.userEmail?.trim() || currentUser?.email || undefined,
        rating: cleanRating,
        comment: reviewData.comment.trim(),
        createdAt: new Date().toISOString(),
        verifiedPurchase: hasCompletedPurchase
      };

      // 1. Save review to Firestore
      await setDoc(doc(db, 'reviews', reviewId), newReview);

      // 2. Compute updated average rating and reviews count for target product
      const existingProductReviews = reviews.filter(r => r.productId === reviewData.productId && r.id !== reviewId);
      const allRatings = [...existingProductReviews.map(r => r.rating), cleanRating];
      const newReviewsCount = allRatings.length;
      const sumRatings = allRatings.reduce((sum, r) => sum + r, 0);
      const newAverageRating = Number((sumRatings / newReviewsCount).toFixed(1));

      // 3. Update the product document in Firestore
      const productDocRef = doc(db, 'products', reviewData.productId);
      await updateDoc(productDocRef, {
        rating: newAverageRating,
        reviewsCount: newReviewsCount,
        updatedAt: new Date().toISOString()
      }).catch((err) => {
        console.warn('Could not update rating on product doc:', err);
      });

      // Optimistic state updates
      setReviews(prev => [newReview, ...prev.filter(r => r.id !== reviewId)]);
      setProducts(prev => prev.map(p => {
        if (p.id === reviewData.productId) {
          return {
            ...p,
            rating: newAverageRating,
            reviewsCount: newReviewsCount
          };
        }
        return p;
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
      throw error;
    }
  };

  const deleteProductReview = async (reviewId: string) => {
    try {
      const targetReview = reviews.find(r => r.id === reviewId);
      await deleteDoc(doc(db, 'reviews', reviewId));

      setReviews(prev => prev.filter(r => r.id !== reviewId));

      if (targetReview) {
        const remainingForProduct = reviews.filter(r => r.productId === targetReview.productId && r.id !== reviewId);
        const newCount = remainingForProduct.length;
        const newAverage = newCount > 0 
          ? Number((remainingForProduct.reduce((sum, r) => sum + r.rating, 0) / newCount).toFixed(1))
          : 5.0;

        const productDocRef = doc(db, 'products', targetReview.productId);
        await updateDoc(productDocRef, {
          rating: newAverage,
          reviewsCount: newCount,
          updatedAt: new Date().toISOString()
        }).catch(e => console.warn('Product doc update error on deleteReview', e));

        setProducts(prev => prev.map(p => {
          if (p.id === targetReview.productId) {
            return { ...p, rating: newAverage, reviewsCount: newCount };
          }
          return p;
        }));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
      throw error;
    }
  };

  // Active Banners (scheduled + active)
  const activeBanners = React.useMemo(() => {
    const now = new Date();
    return banners
      .filter((b) => {
        if (!b.isActive) return false;
        if (b.startDate && new Date(b.startDate) > now) return false;
        if (b.endDate && new Date(b.endDate) < now) return false;
        return true;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [banners]);

  const bannerSliderSettings: BannerSliderSettings = React.useMemo(() => {
    return {
      ...DEFAULT_BANNER_SLIDER_SETTINGS,
      ...(settings.bannerSliderSettings || {})
    };
  }, [settings.bannerSliderSettings]);

  const addBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const bannerId = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const newBanner: Banner = {
        ...bannerData,
        id: bannerId,
        order: bannerData.order ?? (banners.length + 1),
        createdAt: now,
        updatedAt: now
      };
      await setDoc(doc(db, 'banners', bannerId), newBanner);
      setBanners(prev => [...prev, newBanner].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      return bannerId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'banners');
      throw error;
    }
  };

  const updateBanner = async (id: string, updates: Partial<Banner>): Promise<void> => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'banners', id), {
        ...updates,
        updatedAt: now
      });
      setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates, updatedAt: now } : b));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `banners/${id}`);
      throw error;
    }
  };

  const deleteBanner = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'banners', id));
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `banners/${id}`);
      throw error;
    }
  };

  const reorderBanners = async (orderedBanners: Banner[]): Promise<void> => {
    try {
      const now = new Date().toISOString();
      const promises = orderedBanners.map((b, idx) => {
        return updateDoc(doc(db, 'banners', b.id), {
          order: idx + 1,
          updatedAt: now
        });
      });
      await Promise.all(promises);
      setBanners(orderedBanners.map((b, idx) => ({ ...b, order: idx + 1 })));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'banners/reorder');
      throw error;
    }
  };

  const uploadImageFile = async (file: File, folder: string): Promise<string> => {
    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
      const fileRef = storageRef(storage, filename);
      const snapshot = await uploadBytes(fileRef, file, {
        contentType: file.type || 'image/jpeg'
      });
      return await getDownloadURL(snapshot.ref);
    } catch (storageError) {
      console.warn(`Storage upload for ${folder} fallback to Data URL:`, storageError);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  const uploadBannerImage = async (file: File): Promise<string> => {
    return uploadImageFile(file, 'banners');
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    return uploadImageFile(file, 'products');
  };

  const uploadCategoryImage = async (file: File): Promise<string> => {
    return uploadImageFile(file, 'categories');
  };

  const clearAllMockImages = async () => {
    let productsCleaned = 0;
    let categoriesCleaned = 0;
    let bannersCleaned = 0;

    try {
      // 1. Clean Products in Firestore
      const prodsSnap = await getDocs(collection(db, 'products'));
      for (const docSnap of prodsSnap.docs) {
        const data = docSnap.data() as Product;
        let needsUpdate = false;
        let newImage = data.image || '';
        let newImages = data.images || [];

        if (newImage.includes('unsplash.com')) {
          newImage = '';
          needsUpdate = true;
        }
        if (newImages.some(img => img && img.includes('unsplash.com'))) {
          newImages = newImages.filter(img => img && !img.includes('unsplash.com'));
          needsUpdate = true;
        }

        if (needsUpdate) {
          await updateDoc(doc(db, 'products', docSnap.id), {
            image: newImage,
            images: newImages,
            updatedAt: new Date().toISOString()
          }).catch(console.warn);
          productsCleaned++;
        }
      }

      // 2. Clean Categories in Firestore
      const catsSnap = await getDocs(collection(db, 'categories'));
      for (const docSnap of catsSnap.docs) {
        const data = docSnap.data() as Category;
        if (data.image && data.image.includes('unsplash.com')) {
          await updateDoc(doc(db, 'categories', docSnap.id), {
            image: '',
            updatedAt: new Date().toISOString()
          }).catch(console.warn);
          categoriesCleaned++;
        }
      }

      // 3. Clean Banners in Firestore
      const bansSnap = await getDocs(collection(db, 'banners'));
      for (const docSnap of bansSnap.docs) {
        const data = docSnap.data() as Banner;
        let needsUpdate = false;
        let img = data.imageUrl || '';
        let mImg = data.mobileImageUrl || '';
        if (img.includes('unsplash.com')) {
          img = '';
          needsUpdate = true;
        }
        if (mImg.includes('unsplash.com')) {
          mImg = '';
          needsUpdate = true;
        }
        if (needsUpdate) {
          await updateDoc(doc(db, 'banners', docSnap.id), {
            imageUrl: img,
            mobileImageUrl: mImg,
            updatedAt: new Date().toISOString()
          }).catch(console.warn);
          bannersCleaned++;
        }
      }

      // Update in-memory state
      setProducts(prev => prev.map(p => ({
        ...p,
        image: p.image?.includes('unsplash.com') ? '' : p.image,
        images: (p.images || []).filter(img => !img.includes('unsplash.com'))
      })));
      setCategories(prev => prev.map(c => ({
        ...c,
        image: c.image?.includes('unsplash.com') ? '' : c.image
      })));
      setBanners(prev => prev.map(b => ({
        ...b,
        imageUrl: b.imageUrl?.includes('unsplash.com') ? '' : b.imageUrl,
        mobileImageUrl: b.mobileImageUrl?.includes('unsplash.com') ? '' : b.mobileImageUrl
      })));
    } catch (err) {
      console.warn('clearAllMockImages error:', err);
    }

    return { productsCleaned, categoriesCleaned, bannersCleaned };
  };

  // Auto-clean any legacy mock unsplash images on start
  useEffect(() => {
    const timer = setTimeout(() => {
      clearAllMockImages().catch(console.warn);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const updateBannerSliderSettings = async (sliderSettings: Partial<BannerSliderSettings>): Promise<void> => {
    try {
      const merged: BannerSliderSettings = {
        ...DEFAULT_BANNER_SLIDER_SETTINGS,
        ...(settings.bannerSliderSettings || {}),
        ...sliderSettings
      };
      const newSettings: StoreSettings = {
        ...settings,
        bannerSliderSettings: merged,
        updatedAt: new Date().toISOString()
      };
      await saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update banner slider settings:', error);
      throw error;
    }
  };

  // Re-seed all initial demo data to Firestore
  const resetToInitialData = async () => {
    try {
      await setDoc(doc(db, 'storeSettings', 'general'), INITIAL_SETTINGS);
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      for (const coup of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', coup.id), coup);
      }
      for (const aff of INITIAL_AFFILIATES) {
        await setDoc(doc(db, 'affiliates', aff.id), aff);
      }
      for (const pay of INITIAL_PAYOUTS) {
        await setDoc(doc(db, 'payouts', pay.id), pay);
      }
      for (const b of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', b.id), b);
      }
    } catch (error) {
      console.error('Reset initial data error:', error);
    }
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      userProfile,
      isOwner,
      isAdmin,
      isStaff,
      isAffiliate,
      authLoading,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      sendPasswordReset,
      sendEmailVerificationLink,
      logout,
      setDemoAdminMode,
      isDemoAdmin,
      updateUserProfile,
      allUsers,
      updateUserRole,
      products,
      categories,
      banners,
      activeBanners,
      settings,
      bannerSliderSettings,
      addBanner,
      updateBanner,
      deleteBanner,
      reorderBanners,
      uploadBannerImage,
      updateBannerSliderSettings,
      language,
      toggleLanguage,
      coupons,
      orders,
      loadingData,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotalCount,
      cartSubtotal,
      wishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      getBestSellerProducts,
      appliedCoupon,
      appliedAffiliate,
      activeReferralCode,
      applyCoupon,
      removeCoupon,
      createOrder,
      affiliates,
      payouts,
      currentAffiliateProfile,
      applyForAffiliate,
      approveAffiliate,
      rejectAffiliate,
      updateAffiliate,
      requestPayout,
      processPayout,
      updateOrderStatus,
      deleteOrder,
      saveProduct,
      deleteProduct,
      saveCategory,
      deleteCategory,
      saveSettings,
      uploadStoreLogo,
      removeStoreLogo,
      saveCoupon,
      deleteCoupon,
      reviews,
      getProductReviews,
      addProductReview,
      deleteProductReview,
      uploadProductImage,
      uploadCategoryImage,
      clearAllMockImages,
      resetToInitialData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
