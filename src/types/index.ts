export type FlowerType = 'natural' | 'artificial' | 'mix';

export interface ProductSize {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  icon?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

export type OccasionType = 
  | 'birthday'
  | 'wedding'
  | 'graduation'
  | 'newborn'
  | 'apology'
  | 'gratitude'
  | 'romantic'
  | 'seasonal';

export interface OccasionInfo {
  id: OccasionType;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  badge: string;
  bgGradient: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  categoryName?: string;
  image: string;
  images: string[];
  stock: number;
  featured: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  flowerType: FlowerType;
  sizes: ProductSize[];
  addons: ProductAddon[];
  occasions?: OccasionType[];
  rating: number;
  reviewsCount: number;
  allowCardMessage?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  image: string;
  description: string;
  order: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  selectedSize?: ProductSize;
  selectedAddons?: ProductAddon[];
  itemTotal: number;
}

export type OrderStatus = 
  | 'new'
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'mada' | 'apple_pay' | 'visa' | 'cod';
export type PaymentStatus = 'unpaid' | 'paid';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  isGift: boolean;
  recipientName?: string;
  recipientPhone?: string;
  deliveryCity: string;
  deliveryDistrict: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  giftCardMessage?: string;
  giftSenderName?: string;
  surpriseRecipient?: boolean;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  affiliateCode?: string;
  affiliateId?: string;
  commissionAmount?: number;
  commissionStatus?: 'pending' | 'approved' | 'paid' | 'cancelled';
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  driverNotes?: string;
  locationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CityOption {
  name: string;
  fee: number;
  active: boolean;
}

export type AnnouncementIconType = 'sparkles' | 'gift' | 'tag' | 'truck' | 'heart' | 'bell' | 'phone';
export type AnnouncementLinkType = 'none' | 'category' | 'product' | 'coupon' | 'page' | 'custom';
export type AnnouncementMode = 'marquee' | 'slideshow' | 'static';
export type AnnouncementSpeed = 'slow' | 'normal' | 'fast';

export interface AnnouncementItem {
  id: string;
  text: string;
  badge?: string;
  icon?: AnnouncementIconType;
  linkType?: AnnouncementLinkType;
  linkValue?: string;
  linkText?: string;
  isActive: boolean;
}

export interface AnnouncementSettings {
  enabled: boolean;
  mode: AnnouncementMode;
  speed: AnnouncementSpeed;
  durationSeconds: number; // For slideshow mode
  direction: 'rtl' | 'ltr';
  pauseOnHover: boolean;
  closable: boolean;
  showIcon: boolean;
  bgColorStart: string;
  bgColorEnd: string;
  textColor: string;
  accentColor: string;
  messages: AnnouncementItem[];
}

export interface StoreSettings {
  storeName: string;
  storeNameEn: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  taxNumber: string;
  deliveryFeeDefault: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  logoUrl?: string;
  logoStoragePath?: string;
  announcementText: string;
  announcementActive: boolean;
  announcementSettings?: AnnouncementSettings;
  bannerSliderSettings?: BannerSliderSettings;
  cities: CityOption[];
  updatedAt: string;
}

export type BannerLinkType = 'none' | 'category' | 'product' | 'page' | 'custom';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string; // High-res image for desktop
  mobileImageUrl?: string; // Optional optimized image for mobile
  altText: string;
  linkType: BannerLinkType;
  linkValue?: string; // Target slug, product ID, page name, or URL
  buttonText?: string; // e.g. "تسوق الآن"
  isActive: boolean;
  order: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  objectFit?: 'cover' | 'contain' | 'fill';
  createdAt: string;
  updatedAt: string;
}

export interface BannerSliderSettings {
  autoPlay: boolean;
  intervalSeconds: number; // Default 3
  pauseOnHover: boolean;
  showArrows: boolean;
  showDots: boolean;
  transitionEffect: 'slide' | 'fade';
  aspectRatioDesktop: '21/9' | '16/7' | '16/9' | '3/1';
  aspectRatioMobile: '16/9' | '4/3' | '1/1' | '21/9';
  containerMaxWidth: 'full' | 'boxed';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  expiresAt?: string;
}

export type UserRole = 'owner' | 'admin' | 'employee' | 'customer' | 'affiliate';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  status?: 'active' | 'suspended';
  emailVerified?: boolean;
  affiliateId?: string;
  wishlist?: string[];
  createdAt: string;
}

export interface AffiliateProfile {
  id: string; // Document ID (usually matches userId)
  userId: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  referralCode: string; // e.g. "FATEN10"
  commissionType: 'percentage' | 'fixed';
  commissionValue: number; // e.g. 10 (%) or 15 (SAR)
  customerDiscountPercent: number; // e.g. 10%
  totalClicks: number;
  totalOrders: number;
  totalSales: number;
  totalEarnings: number;
  paidEarnings: number;
  pendingBalance: number;
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  socialChannels?: string;
  notes?: string;
  appliedAt: string;
  approvedAt?: string;
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  bankName: string;
  accountHolder: string;
  iban: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
  adminNotes?: string;
}

export interface AffiliateTransaction {
  id: string;
  affiliateId: string;
  orderId: string;
  orderNumber: string;
  orderTotal: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item uuid (product + variations)
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  selectedAddons: ProductAddon[];
  giftCardMessage?: string;
  unitPrice: number;
  totalPrice: number;
}
