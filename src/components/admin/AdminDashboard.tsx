import React, { useState } from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Settings as SettingsIcon, 
  Tag, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  Download, 
  Search, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  DollarSign, 
  Truck, 
  Gift, 
  Eye, 
  FileText,
  Filter,
  Bell,
  BellRing,
  Zap,
  X,
  Sparkles,
  PackageOpen,
  Share2,
  BadgePercent,
  UserCheck,
  UserX,
  CreditCard,
  ArrowUpRight,
  Send,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  Product, 
  Order, 
  OrderStatus, 
  Category, 
  Coupon, 
  StoreSettings, 
  AffiliateProfile, 
  PayoutRequest, 
  UserProfile, 
  UserRole 
} from '../../types';
import { INITIAL_SETTINGS, DEFAULT_ANNOUNCEMENT_SETTINGS } from '../../lib/initialData';
import { AnnouncementSettingsManager } from './AnnouncementSettingsManager';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    products, 
    categories, 
    coupons, 
    settings, 
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
    resetToInitialData,
    currentUser,
    isDemoAdmin,
    isOwner,
    allUsers,
    updateUserRole,
    affiliates,
    payouts,
    approveAffiliate,
    rejectAffiliate,
    updateAffiliate,
    processPayout
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'inventory' | 'coupons' | 'settings' | 'announcements' | 'reports' | 'affiliates' | 'users'>('overview');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [announcementSaveSuccess, setAnnouncementSaveSuccess] = useState(false);
  
  // Affiliates management state
  const [affiliatesSubTab, setAffiliatesSubTab] = useState<'active' | 'applications' | 'payouts'>('active');
  const [selectedAffiliateForApproval, setSelectedAffiliateForApproval] = useState<AffiliateProfile | null>(null);
  const [approvalCode, setApprovalCode] = useState('');
  const [approvalCommissionType, setApprovalCommissionType] = useState<'percentage' | 'fixed'>('percentage');
  const [approvalCommissionValue, setApprovalCommissionValue] = useState<number>(10);
  const [approvalDiscountValue, setApprovalDiscountValue] = useState<number>(10);
  
  // Edit commission modal
  const [editingAffiliateCommission, setEditingAffiliateCommission] = useState<AffiliateProfile | null>(null);
  const [editCommissionType, setEditCommissionType] = useState<'percentage' | 'fixed'>('percentage');
  const [editCommissionValue, setEditCommissionValue] = useState<number>(10);
  const [editDiscountValue, setEditDiscountValue] = useState<number>(10);

  // Payout processing modal
  const [selectedPayoutForProcessing, setSelectedPayoutForProcessing] = useState<PayoutRequest | null>(null);
  const [payoutTransactionRef, setPayoutTransactionRef] = useState('');
  const [payoutAdminNotes, setPayoutAdminNotes] = useState('');
  
  // User role filter & edit state
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Orders filter & search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Product modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Category modal
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Coupon modal
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [logoUploadSuccess, setLogoUploadSuccess] = useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement | null>(null);

  // Delivery zones/districts management
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newDistrictFee, setNewDistrictFee] = useState<number>(20);

  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleAddDistrict = () => {
    if (!newDistrictName.trim()) return;
    const currentCities = settingsForm.cities || [];
    setSettingsForm({
      ...settingsForm,
      cities: [
        ...currentCities,
        { name: newDistrictName.trim(), fee: Number(newDistrictFee) || 20, active: true }
      ]
    });
    setNewDistrictName('');
    setNewDistrictFee(20);
  };

  const handleToggleDistrict = (index: number) => {
    const currentCities = [...(settingsForm.cities || [])];
    if (currentCities[index]) {
      currentCities[index] = { ...currentCities[index], active: !currentCities[index].active };
      setSettingsForm({ ...settingsForm, cities: currentCities });
    }
  };

  const handleUpdateDistrictFee = (index: number, fee: number) => {
    const currentCities = [...(settingsForm.cities || [])];
    if (currentCities[index]) {
      currentCities[index] = { ...currentCities[index], fee };
      setSettingsForm({ ...settingsForm, cities: currentCities });
    }
  };

  const handleRemoveDistrict = (index: number) => {
    const currentCities = [...(settingsForm.cities || [])];
    currentCities.splice(index, 1);
    setSettingsForm({ ...settingsForm, cities: currentCities });
  };

  // Handle Logo File Upload to Firebase Storage
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setLogoUploadError('يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت');
      return;
    }

    setLogoUploading(true);
    setLogoUploadError(null);
    setLogoUploadSuccess(null);

    try {
      const downloadUrl = await uploadStoreLogo(file);
      setSettingsForm(prev => ({
        ...prev,
        logoUrl: downloadUrl
      }));
      setLogoUploadSuccess('تم رفع شعار المتجر بنجاح وتخزينه في Firebase Storage ✅');
    } catch (err: any) {
      console.error('Logo upload failed:', err);
      setLogoUploadError(err?.message || 'حدث خطأ أثناء رفع الشعار إلى Firebase Storage');
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  // Handle Logo Removal
  const handleRemoveLogo = async () => {
    if (!confirm('هل أنت متأكد من حذف شعار المتجر الحالي والعودة للشعار الافتراضي؟')) return;
    setLogoUploading(true);
    setLogoUploadError(null);
    try {
      await removeStoreLogo();
      setSettingsForm(prev => ({
        ...prev,
        logoUrl: '',
        logoStoragePath: ''
      }));
      setLogoUploadSuccess('تم حذف الشعار بنجاح والرجوع للأيقونة الافتراضية');
    } catch (err: any) {
      setLogoUploadError('حدث خطأ أثناء حذف الشعار');
    } finally {
      setLogoUploading(false);
    }
  };

  // Real-time calculations from Firestore data
  const validOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'processing');
  const outForDeliveryOrders = orders.filter(o => o.status === 'out_for_delivery');
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  // Low Stock Alert System State
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [showStockAlertBanner, setShowStockAlertBanner] = useState<boolean>(true);
  const [showStockAlertModal, setShowStockAlertModal] = useState<boolean>(false);
  const [restockSuccessMessage, setRestockSuccessMessage] = useState<string | null>(null);
  const [inventoryAlertFilter, setInventoryAlertFilter] = useState<'all' | 'critical' | 'out_of_stock'>('all');

  const outOfStockProducts = products.filter(p => p.stock === 0);
  const criticalLowProducts = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);
  const allAlertProducts = products.filter(p => p.stock <= lowStockThreshold);
  const lowStockProducts = allAlertProducts;

  // Quick Restock Handler
  const handleQuickRestock = async (product: Product, addAmount: number) => {
    try {
      const newStock = Math.max(0, (product.stock || 0) + addAmount);
      await saveProduct({
        ...product,
        stock: newStock
      });
      setRestockSuccessMessage(`تم تزويد مخزون "${product.name}" بنجاح (${newStock} قطع) ✅`);
      setTimeout(() => setRestockSuccessMessage(null), 3500);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث المخزون');
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch = !orderSearchQuery.trim() || 
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerPhone.includes(orderSearchQuery) ||
      (order.recipientName && order.recipientName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Handle Save Product
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      alert('يرجى ملء الحقول الإلزامية للمنتج');
      return;
    }
    await saveProduct(editingProduct as any);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Handle Save Category
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.slug) {
      alert('يرجى ملء اسم التصنيف والاسم اللطيف (Slug)');
      return;
    }
    await saveCategory(editingCategory as any);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Handle Save Coupon
  const handleSaveCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code || !editingCoupon?.discountValue) {
      alert('يرجى إدخال كود الخصم وقيمة الخصم');
      return;
    }
    await saveCoupon(editingCoupon as any);
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
  };

  // Handle Save Store Settings
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settingsForm);
    alert('تم حفظ إعدادات المتجر بنجاح على قاعدة البيانات السحابية ✅');
  };

  // Handle Save Announcement Settings
  const handleSaveAnnouncementSettings = async () => {
    setIsSavingAnnouncement(true);
    try {
      await saveSettings(settingsForm);
      setAnnouncementSaveSuccess(true);
      setTimeout(() => setAnnouncementSaveSuccess(false), 4500);
    } catch (err) {
      console.error('Error saving announcements:', err);
      alert('حدث خطأ أثناء حفظ إعدادات شريط الإعلانات في قاعدة البيانات');
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['رقم الطلب', 'العميل', 'الجوال', 'المدينة', 'الإجمالي', 'الحالة', 'وسيلة الدفع', 'التاريخ'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      o.deliveryCity,
      o.total,
      o.status,
      o.paymentMethod,
      new Date(o.createdAt).toLocaleDateString('ar-SA')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flora_faten_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-[#AD647D] via-[#BF7891] to-[#AD647D] rounded-3xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFE680]" />
              لوحة التحكم والإدارة المركزية
            </span>
            <span className="bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
              <Database className="w-3 h-3" />
              مزامنة سحابية حية
            </span>
          </div>
          <h1 className="text-2xl font-black font-serif-lux">Flora Faten Management</h1>
          <p className="text-xs text-pink-100 mt-1">
            إدارة الطلبات، المنتجات، العملاء، التوصيل، الإحصائيات الحقيقية لمتجر فلورا فاتن
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Notification Bell Button */}
          <button
            onClick={() => setShowStockAlertModal(true)}
            className={`relative py-2.5 px-3.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              allAlertProducts.length > 0
                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-md ring-2 ring-amber-200'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="تنبيهات المخزون والنفاد"
          >
            {allAlertProducts.length > 0 ? (
              <BellRing className="w-4 h-4 animate-bounce text-amber-950" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            <span>تنبيهات المخزون</span>
            {allAlertProducts.length > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-xs">
                {allAlertProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                description: '',
                price: 250,
                category: categories[0]?.slug || 'pink-white-bouquets',
                stock: 15,
                flowerType: 'natural',
                image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
                featured: false
              });
              setIsProductModalOpen(true);
            }}
            className="py-2.5 px-4 bg-white text-[#AD647D] hover:bg-[#FFF0F4] rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>

          <button
            onClick={resetToInitialData}
            title="إعادة تهيئة البيانات الافتراضية إذا رغبت"
            className="py-2.5 px-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-medium transition flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تهيئة الكتالوج</span>
          </button>
        </div>
      </div>

      {/* Prominent Visual Low-Stock Alert Banner */}
      {showStockAlertBanner && allAlertProducts.length > 0 && (
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-300 p-4 sm:p-5 shadow-sm text-right relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> تنبيه اقتراب نفاد المخزون
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-amber-950">
                    يوجد {allAlertProducts.length} باقة وهدية أوشكت على النفاد وتحتاج إلى تزويد عاجل!
                  </h3>
                </div>
                <p className="text-xs text-amber-900/80 mt-1">
                  {outOfStockProducts.length > 0 && (
                    <strong className="text-red-700 ml-2 font-bold">
                      ⚠️ {outOfStockProducts.length} منتج نفد مخزونه بالكامل (0 قطع)
                    </strong>
                  )}
                  {criticalLowProducts.length > 0 && (
                    <span className="text-amber-800">
                      • {criticalLowProducts.length} منتج متبقي منه {lowStockThreshold} قطع أو أقل
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => setShowStockAlertModal(true)}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>مركز التزويد السريع</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className="py-2.5 px-3 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 rounded-xl text-xs font-bold transition"
              >
                جدول المخزون
              </button>

              <button
                onClick={() => setShowStockAlertBanner(false)}
                className="p-2 text-amber-700 hover:text-amber-950 transition"
                title="إخفاء التنبيه مؤقتاً"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Quick 1-Click Restock Cards Strip */}
          <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-amber-900 shrink-0">
              ⚡ إعادة تزويد بضغطة زر:
            </span>
            {allAlertProducts.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 bg-white/95 border border-amber-200 px-3 py-1.5 rounded-2xl shrink-0 shadow-2xs hover:border-amber-400 transition"
              >
                <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <div className="text-xs font-bold text-[#2D141E] max-w-[130px] truncate">{item.name}</div>
                  <div className={`text-[10px] font-black ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {item.stock === 0 ? 'نفد (0)' : `متبقي: ${item.stock}`}
                  </div>
                </div>
                <button
                  onClick={() => handleQuickRestock(item, 10)}
                  className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition shadow-2xs flex items-center gap-1"
                  title="إضافة 10 قطع للمخزون فوراً"
                >
                  <Plus className="w-3 h-3" />
                  <span>10 قطع</span>
                </button>
              </div>
            ))}
            {allAlertProducts.length > 6 && (
              <button
                onClick={() => setShowStockAlertModal(true)}
                className="text-xs font-bold text-amber-800 hover:underline shrink-0 px-2"
              >
                +{allAlertProducts.length - 6} باقات أخرى...
              </button>
            )}
          </div>

        </div>
      )}

      {/* Restock Success Toast */}
      {restockSuccessMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn border border-emerald-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{restockSuccessMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#F8DDE6] text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>نظرة عامة وإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 relative ${
            activeTab === 'orders'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إدارة الطلبات</span>
          {pendingOrders.length > 0 && (
            <span className="bg-[#C9A46A] text-white rounded-full px-1.5 py-0.2 text-[10px] font-black">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>المنتجات ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>التصنيفات ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>المخزون والتنبيهات</span>
          {lowStockProducts.length > 0 && (
            <span className="bg-red-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-black">
              {lowStockProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'coupons'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>الكوبونات والخصومات</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'announcements'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C9A46A]" />
          <span>شريط الإعلانات الترويجي</span>
          {settingsForm.announcementSettings?.enabled !== false && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>إعدادات المتجر والتوصيل</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>التقارير المالية</span>
        </button>

        <button
          onClick={() => setActiveTab('affiliates')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 relative ${
            activeTab === 'affiliates'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <Share2 className="w-4 h-4 text-[#C9A46A]" />
          <span>المسوقون وصناع المحتوى</span>
          {affiliates.filter(a => a.status === 'pending').length > 0 && (
            <span className="bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-black">
              {affiliates.filter(a => a.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-[#AD647D] text-white shadow-xs'
              : 'bg-white text-[#4A2030] hover:bg-pink-50 border border-[#F8DDE6]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المستخدمون والصلاحيات</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 block">إجمالي المبيعات المحققة</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#AD647D]">{totalRevenue.toLocaleString()}</span>
                  <span className="text-xs font-bold text-[#AD647D]">ر.س</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                  من {validOrders.length} طلب مؤكد
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#AD647D] flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 block">إجمالي الطلبات المستلمة</span>
                <div className="text-2xl font-black text-[#2D141E] mt-1">{totalOrdersCount}</div>
                <span className="text-[10px] text-gray-400 mt-1 block">مخزنة في Firestore</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9FA] text-[#C9A46A] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 block">طلبات قيد التجهيز والتوصيل</span>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {pendingOrders.length + outForDeliveryOrders.length}
                </div>
                <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                  {outForDeliveryOrders.length} خرجت مع المندوب
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 block">متوسط قيمة السلة (AOV)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-emerald-700">{avgOrderValue}</span>
                  <span className="text-xs font-bold text-emerald-700">ر.س</span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">لكل عملية شراء</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Quick breakdown of recent orders & alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Orders in overview */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#F8DDE6] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pink-50">
                <h3 className="text-sm font-bold text-[#2D141E]">أحدث طلبات المتجر</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#AD647D] font-bold hover:underline"
                >
                  عرض كافة الطلبات ({orders.length})
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  لا توجد طلبات بعد. بمجرد قيام أي عميل بطلب باقة سيظهر فوراً هنا.
                </div>
              ) : (
                <div className="divide-y divide-pink-50">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-[#2D141E] flex items-center gap-2">
                          <span className="font-mono text-[#AD647D]">{ord.orderNumber}</span>
                          <span>- {ord.customerName}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {ord.deliveryCity} • {ord.items.length} منتجات • {new Date(ord.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-[#AD647D]">{ord.total} ر.س</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          ord.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory Alerts Box */}
            <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pink-50">
                <h3 className="text-sm font-bold text-[#2D141E]">تنبيهات المخزون</h3>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                  {lowStockProducts.length}
                </span>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-emerald-600 font-semibold flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <span>جميع المنتجات متوفرة بمخزون كافٍ وممتاز!</span>
                </div>
              ) : (
                <div className="divide-y divide-pink-50 space-y-2">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold line-clamp-1">{p.name}</div>
                          <span className="text-[10px] text-red-500 font-bold">متبقي: {p.stock}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsProductModalOpen(true);
                        }}
                        className="text-[11px] text-[#AD647D] hover:underline"
                      >
                        تعديل
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls: Search, Status Filter & Export */}
          <div className="bg-white p-4 rounded-3xl border border-[#F8DDE6] flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="بحث برقم الطلب، اسم العميل، الجوال..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 pr-9 pl-3 text-xs"
                />
                <Search className="w-3.5 h-3.5 text-[#AD647D] absolute right-3 top-3" />
              </div>

              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs font-bold text-[#4A2030]"
              >
                <option value="all">كافة الحالات ({orders.length})</option>
                <option value="new">طلبات جديدة</option>
                <option value="paid">مدفوعة</option>
                <option value="processing">قيد التجهيز</option>
                <option value="out_for_delivery">خرجت للتوصيل</option>
                <option value="completed">مكتملة ومسلمة</option>
                <option value="cancelled">ملغية</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="py-2 px-3.5 bg-[#FFF0F4] border border-[#F8DDE6] hover:bg-[#E7A0B4] hover:text-white text-[#AD647D] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير Excel / CSV</span>
              </button>
            </div>

          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-[#F8DDE6] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#FFF9FA] text-[#AD647D] border-b border-[#F8DDE6] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">رقم الطلب</th>
                    <th className="py-3.5 px-4">العميل والمستلم</th>
                    <th className="py-3.5 px-4">المدينة وموعد التسليم</th>
                    <th className="py-3.5 px-4">محتوى الطلب</th>
                    <th className="py-3.5 px-4">الإجمالي</th>
                    <th className="py-3.5 px-4">طريقة الدفع</th>
                    <th className="py-3.5 px-4">حالة الطلب</th>
                    <th className="py-3.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 text-[#2D141E]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        لا توجد طلبات تطابق معايير البحث الحالية
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FFFDFD] transition">
                        {/* Order Number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#AD647D]">
                          {ord.orderNumber}
                          <span className="block text-[10px] text-gray-400 font-sans font-normal">
                            {new Date(ord.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </td>

                        {/* Customer & Recipient */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold">{ord.customerName}</div>
                          <div className="text-[10px] text-gray-500 font-mono" dir="ltr">{ord.customerPhone}</div>
                          {ord.isGift && ord.recipientName && (
                            <span className="inline-block mt-0.5 bg-pink-50 text-[#AD647D] px-1.5 py-0.2 rounded text-[10px]">
                              إهداء إلى: {ord.recipientName}
                            </span>
                          )}
                        </td>

                        {/* City & Delivery Slot */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold">{ord.deliveryCity}</div>
                          <div className="text-[10px] text-gray-500">{ord.deliveryDate}</div>
                          <div className="text-[10px] text-gray-400">{ord.deliveryTimeSlot}</div>
                        </td>

                        {/* Items preview */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-[11px] truncate">
                                • {it.name} (x{it.quantity})
                              </div>
                            ))}
                          </div>
                          {ord.giftCardMessage && (
                            <span className="text-[10px] text-[#C9A46A] italic block mt-1 line-clamp-1">
                              💌 "{ord.giftCardMessage}"
                            </span>
                          )}
                        </td>

                        {/* Total */}
                        <td className="py-3.5 px-4 font-black text-sm text-[#AD647D]">
                          {ord.total} ر.س
                        </td>

                        {/* Payment */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold block">
                            {ord.paymentMethod === 'mada' ? 'مدى Mada' :
                             ord.paymentMethod === 'apple_pay' ? ' Pay' :
                             ord.paymentMethod === 'visa' ? 'Visa / MC' : 'عند الاستلام'}
                          </span>
                          <span className={`text-[10px] font-bold ${ord.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {ord.paymentStatus === 'paid' ? 'مدفوع ✅' : 'غير مدفوع'}
                          </span>
                        </td>

                        {/* Status Dropdown (live Firestore update!) */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                              ord.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              ord.status === 'out_for_delivery' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              ord.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-300' :
                              'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="new">جديد</option>
                            <option value="pending_payment">بانتظار الدفع</option>
                            <option value="paid">مدفوع</option>
                            <option value="processing">قيد التجهيز</option>
                            <option value="out_for_delivery">خرج للتوصيل</option>
                            <option value="completed">مكتمل (تم التسليم)</option>
                            <option value="cancelled">ملغي</option>
                            <option value="refunded">مسترجع</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              title="طباعة الفاتورة"
                              className="p-1.5 bg-[#FFF0F4] hover:bg-[#E7A0B4] hover:text-white text-[#AD647D] rounded-lg transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف الطلب ${ord.orderNumber} نهائيًا؟`)) {
                                  deleteOrder(ord.id);
                                }
                              }}
                              title="حذف"
                              className="p-1.5 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D141E]">
              كتالوج المنتجات والباقات ({products.length})
            </h3>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  description: '',
                  price: 260,
                  category: categories[0]?.slug || 'pink-white-bouquets',
                  stock: 12,
                  flowerType: 'natural',
                  image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
                  featured: false
                });
                setIsProductModalOpen(true);
              }}
              className="py-2.5 px-4 bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-[#F8DDE6] p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {p.flowerType === 'natural' ? 'طبيعي' : 'صناعي'}
                    </span>
                    <span className="absolute bottom-2 left-2 bg-white/90 text-[#AD647D] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-2xs">
                      المخزون: {p.stock}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#C9A46A] font-semibold">{p.categoryName}</span>
                  <h4 className="font-bold text-xs text-[#2D141E] line-clamp-1">{p.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1 text-[#AD647D] font-black text-sm">
                    <span>{p.salePrice ?? p.price} ر.س</span>
                    {p.salePrice && (
                      <span className="text-[10px] text-gray-400 line-through">{p.price} ر.س</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-pink-50 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setIsProductModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#AD647D] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف المنتج "${p.name}" نهائيًا من المتجر وقاعدة البيانات؟`)) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D141E]">
              إدارة تصنيفات المتجر ({categories.length})
            </h3>
            <button
              onClick={() => {
                setEditingCategory({
                  name: '',
                  nameEn: '',
                  slug: '',
                  image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
                  description: '',
                  order: categories.length + 1
                });
                setIsCategoryModalOpen(true);
              }}
              className="py-2 px-4 bg-[#AD647D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تصنيف جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-[#F8DDE6] p-4 flex items-center gap-3">
                <img src={c.image} className="w-16 h-16 rounded-xl object-cover border border-[#F8DDE6]" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-[#2D141E]">{c.name}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">{c.slug}</span>
                  <div className="text-[10px] text-[#C9A46A] mt-1">الترتيب: {c.order}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1.5 text-[#AD647D] hover:bg-pink-50 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف تصنيف "${c.name}"؟`)) {
                        deleteCategory(c.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Inventory Overview and Alert Configuration Card */}
          <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#2D141E]">
                    نظام مراقبة المخزون والتنبيهات المباشرة
                  </h3>
                  {allAlertProducts.length > 0 && (
                    <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                      {allAlertProducts.length} تنبيه نشط
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  مزامنة لحظية لكميات المخزون مع تنبيهات مرئية تلقائية عند اقتراب أي منتج من النفاد
                </p>
              </div>

              {/* Threshold Selector */}
              <div className="flex items-center gap-2 bg-[#FFF9FA] border border-[#F8DDE6] p-2 rounded-2xl">
                <span className="text-[11px] font-bold text-[#AD647D] shrink-0">حد التنبيه:</span>
                {[3, 5, 8, 10, 15].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLowStockThreshold(val)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                      lowStockThreshold === val
                        ? 'bg-[#AD647D] text-white shadow-2xs'
                        : 'text-gray-500 hover:text-[#AD647D] hover:bg-pink-100/60'
                    }`}
                  >
                    {val} قطع
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Status Badges & Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setInventoryAlertFilter('all')}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition ${
                    inventoryAlertFilter === 'all'
                      ? 'bg-[#AD647D] text-white'
                      : 'bg-[#FFF9FA] border border-[#F8DDE6] text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  كافة المنتجات ({products.length})
                </button>

                <button
                  type="button"
                  onClick={() => setInventoryAlertFilter('critical')}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    inventoryAlertFilter === 'critical'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>أوشكت على النفاد (متبقي ≤ {lowStockThreshold}) : {criticalLowProducts.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInventoryAlertFilter('out_of_stock')}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    inventoryAlertFilter === 'out_of_stock'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-50 border border-red-200 text-red-900 hover:bg-red-100'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>نفدت تماماً (0 قطع) : {outOfStockProducts.length}</span>
                </button>
              </div>

              <div className="text-xs text-gray-400">
                إجمالي قطع المخزون: <strong>{products.reduce((acc, p) => acc + (p.stock || 0), 0)} قطعة</strong>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto border border-[#F8DDE6] rounded-2xl">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#FFF9FA] text-[#AD647D] border-b border-[#F8DDE6] font-bold">
                  <tr>
                    <th className="p-3">المنتج</th>
                    <th className="p-3">التصنيف</th>
                    <th className="p-3">السعر</th>
                    <th className="p-3">المخزون الحالي</th>
                    <th className="p-3">حالة التنبيه</th>
                    <th className="p-3 text-center">إعادة تزويد سريعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {products
                    .filter((p) => {
                      if (inventoryAlertFilter === 'critical') return p.stock > 0 && p.stock <= lowStockThreshold;
                      if (inventoryAlertFilter === 'out_of_stock') return p.stock === 0;
                      return true;
                    })
                    .map((p) => {
                      const isOutOfStock = p.stock === 0;
                      const isLowStock = p.stock > 0 && p.stock <= lowStockThreshold;

                      return (
                        <tr 
                          key={p.id}
                          className={`transition ${
                            isOutOfStock ? 'bg-red-50/40' : isLowStock ? 'bg-amber-50/30' : 'hover:bg-[#FFFDFD]'
                          }`}
                        >
                          <td className="p-3 flex items-center gap-2.5">
                            <img src={p.image} className="w-10 h-10 rounded-xl object-cover border border-[#F8DDE6]" />
                            <div>
                              <span className="font-bold block text-[#2D141E]">{p.name}</span>
                              <span className="text-[10px] text-gray-400">{p.flowerType === 'natural' ? 'طبيعي' : 'صناعي'}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-500">{p.categoryName}</td>
                          <td className="p-3 font-bold text-[#AD647D]">{p.salePrice ?? p.price} ر.س</td>
                          <td className="p-3 font-mono font-black text-sm">
                            <span className={isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'}>
                              {p.stock} قطعة
                            </span>
                          </td>
                          <td className="p-3">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300 animate-pulse">
                                <AlertCircle className="w-3 h-3 text-red-600" />
                                <span>نفدت الكمية تماماً!</span>
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>أوشك على النفاد (متبقي {p.stock})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>المخزون متوفر وممتاز</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickRestock(p, -1)}
                                disabled={p.stock <= 0}
                                className="px-2 py-1 bg-pink-50 hover:bg-pink-100 disabled:opacity-30 rounded-lg text-[10px] font-bold text-[#AD647D]"
                                title="إنقاص 1"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickRestock(p, 5)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg text-[10px] font-bold text-amber-900 border border-amber-200"
                                title="إضافة 5 قطع"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => handleQuickRestock(p, 10)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-[10px] font-bold text-emerald-800 border border-emerald-200"
                                title="إضافة 10 قطع"
                              >
                                +10 قطع
                              </button>
                              <button
                                onClick={() => handleQuickRestock(p, 25)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs"
                                title="إضافة 25 قطعة شحنة جديدة"
                              >
                                +25
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D141E]">
              كوبونات الخصم والعروض الترويجية ({coupons.length})
            </h3>
            <button
              onClick={() => {
                setEditingCoupon({
                  code: '',
                  discountType: 'percentage',
                  discountValue: 10,
                  minOrderAmount: 150,
                  isActive: true,
                  usageCount: 0
                });
                setIsCouponModalOpen(true);
              }}
              className="py-2 px-4 bg-[#AD647D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كود خصم جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-[#F8DDE6] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-[#AD647D] bg-[#FFF0F4] px-3 py-1 rounded-xl">
                    {c.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.isActive ? 'مفعّل' : 'معطّل'}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-gray-600">
                  <div>
                    الخصم: <strong>{c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} ر.س`}</strong>
                  </div>
                  <div>الحد الأدنى للطلب: {c.minOrderAmount} ر.س</div>
                  <div className="text-[10px] text-gray-400">مرات الاستخدام: {c.usageCount || 0}</div>
                </div>

                <div className="pt-2 border-t border-pink-50 flex items-center justify-between text-xs">
                  <button
                    onClick={() => saveCoupon({ ...c, isActive: !c.isActive })}
                    className="text-[#AD647D] font-bold hover:underline"
                  >
                    {c.isActive ? 'تعطيل الكود' : 'تفعيل الكود'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف كود الخصم "${c.code}"؟`)) {
                        deleteCoupon(c.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: STORE SETTINGS & DELIVERY */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          <form onSubmit={handleSaveSettingsSubmit} className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-6">
            <h3 className="text-sm font-bold text-[#2D141E] border-b border-pink-100 pb-3 flex items-center justify-between">
              <span>إعدادات المتجر والتوصيل والهوية</span>
              <span className="text-[11px] font-normal text-gray-400">تحديث فوري لجميع صفحات الموقع</span>
            </h3>

            {/* STORE LOGO UPLOAD & FIREBASE STORAGE SECTION */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF9FA] via-[#FFF5F8] to-[#FFF9FA] border border-[#F8DDE6] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Current Logo Preview */}
                  <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-[#C9A46A] shadow-md flex items-center justify-center overflow-hidden shrink-0 group">
                    {settingsForm.logoUrl ? (
                      <img
                        src={settingsForm.logoUrl}
                        alt="شعار المتجر"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#E7A0B4] to-[#F8DDE6] flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-[#AD647D]" />
                      </div>
                    )}
                    {logoUploading && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#2D141E] flex items-center gap-2">
                      <span>شعار المتجر الرسمي (Store Logo)</span>
                      {settingsForm.logoUrl ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> مخزن في Firebase Storage
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                          الشعار الافتراضي
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-md">
                      ارفع صورة الشعار بدقة عالية ليتم حفظها سحابياً في Firebase Storage وعرضها تلقائياً وبشكل ديناميكي في شريط التنقل (Navbar)، والتذييل (Footer)، والفواتير، وقوالب الرسائل البريدية.
                    </p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      الصيغ المدعومة: PNG, JPG, SVG, WebP • الحجم الأقصى: 5 ميجابايت • يفضل خلفية شفافة
                    </span>
                  </div>
                </div>

                {/* Upload & Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoFileChange}
                    className="hidden"
                    disabled={logoUploading}
                  />

                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoUploading}
                    className="flex-1 sm:flex-none py-2 px-4 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {logoUploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{settingsForm.logoUrl ? 'تغيير الشعار' : 'رفع شعار جديد'}</span>
                      </>
                    )}
                  </button>

                  {settingsForm.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={logoUploading}
                      className="py-2 px-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      title="حذف الشعار واستعادة الافتراضي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status messages */}
              {logoUploadError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{logoUploadError}</span>
                </div>
              )}

              {logoUploadSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{logoUploadSuccess}</span>
                </div>
              )}

              {/* Optional direct URL input */}
              <div className="pt-2 border-t border-pink-100 flex flex-col sm:flex-row items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium shrink-0">أو رابط مباشر للشعار:</span>
                <input
                  type="url"
                  placeholder="https://..."
                  value={settingsForm.logoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  className="w-full bg-white border border-[#F8DDE6] rounded-xl py-1.5 px-3 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم المتجر</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الرقم الضريبي VAT</label>
                <input
                  type="text"
                  value={settingsForm.taxNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, taxNumber: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الواتساب للطلبات</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">هاتف خدمة العملاء</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني للإدارة والمراسلات</label>
                <input
                  type="email"
                  value={settingsForm.email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">موقع المعرض / المدينة</label>
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, address: 'مكة المكرمة - حي الحمراء، المملكة العربية السعودية' })}
                    className="text-[10px] text-[#AD647D] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>🌸 تعيين: مكة المكرمة - حي الحمراء</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  placeholder="مكة المكرمة - حي الحمراء، المملكة العربية السعودية"
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رسوم التوصيل الافتراضية بمكة المكرمة (ر.س)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeDefault}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeDefault: Number(e.target.value) })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">حد التوصيل المجاني (ر.س)</label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full bg-[#FFFDFD] border border-[#F8DDE6] rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            {/* Delivery Zones & Districts Management (Makkah Al-Hamra) */}
            <div className="pt-6 border-t border-pink-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#AD647D] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#C9A46A]" />
                    <span>مناطق وأحياء التوصيل بمكة المكرمة (حي الحمراء وكافة الأحياء)</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    حدد تكلفة التوصيل لكل حي في مكة المكرمة مع تفعيل أو تعطيل التوصيل للحي
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, cities: INITIAL_SETTINGS.cities })}
                  className="text-[10px] text-gray-500 hover:text-[#AD647D] underline"
                >
                  استعادة قائمة أحياء مكة الافتراضية
                </button>
              </div>

              {/* Districts List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(settingsForm.cities || []).map((city, idx) => {
                  const isHamra = city.name.includes('الحمراء');
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border text-xs transition ${
                        isHamra 
                          ? 'bg-[#FFF9FA] border-[#E7A0B4]' 
                          : 'bg-[#FFFDFD] border-[#F8DDE6]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={city.active}
                          onChange={() => handleToggleDistrict(idx)}
                          className="accent-[#AD647D] w-3.5 h-3.5"
                        />
                        <span className={`font-medium ${city.active ? 'text-[#2D141E]' : 'text-gray-400 line-through'}`}>
                          {city.name}
                        </span>
                        {isHamra && (
                          <span className="text-[10px] bg-[#F8DDE6] text-[#AD647D] px-2 py-0.5 rounded-full font-bold">
                            🌸 المقر الرئيسي
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">الرسوم:</span>
                        <input
                          type="number"
                          value={city.fee}
                          onChange={(e) => handleUpdateDistrictFee(idx, Number(e.target.value))}
                          className="w-16 bg-white border border-[#F8DDE6] rounded-lg py-1 px-2 text-xs text-center font-bold text-[#AD647D]"
                        />
                        <span className="text-[10px] text-gray-400">ر.س</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDistrict(idx)}
                          className="text-gray-300 hover:text-red-500 p-1"
                          title="حذف الحي"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New District */}
              <div className="flex items-center gap-2 bg-[#FFF0F4]/60 p-3 rounded-2xl border border-dashed border-[#F8DDE6]">
                <input
                  type="text"
                  placeholder="اسم الحي أو المنطقة الجديدة بمكة (مثال: مكة المكرمة - حي الفيحاء)..."
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  className="flex-1 bg-white border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="الرسوم"
                    value={newDistrictFee}
                    onChange={(e) => setNewDistrictFee(Number(e.target.value))}
                    className="w-18 bg-white border border-[#F8DDE6] rounded-xl py-2 px-2 text-xs text-center font-bold"
                  />
                  <span className="text-[11px] text-gray-500">ر.س</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddDistrict}
                  className="py-2 px-4 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl text-xs font-bold transition shrink-0"
                >
                  إضافة الحي
                </button>
              </div>
            </div>

            {/* Announcement Banner Shortcut Card */}
            <div className="pt-4 border-t border-pink-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#AD647D] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A46A]" />
                    <span>شريط الإعلانات الترويجي أعلى المتجر</span>
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    يدعم النص المتحرك (Marquee)، تتابع الرسائل، تخصيص الألوان، والأكوابون والروابط
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('announcements')}
                    className="py-1.5 px-3 bg-[#FFF0F4] hover:bg-[#F8DDE6] border border-[#F8DDE6] text-[#AD647D] rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>لوحة التحكم الكاملة للشريط</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <label className="flex items-center gap-1.5 text-xs cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.announcementSettings?.enabled ?? settingsForm.announcementActive}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        const currAnn = settingsForm.announcementSettings || DEFAULT_ANNOUNCEMENT_SETTINGS;
                        setSettingsForm({
                          ...settingsForm,
                          announcementActive: enabled,
                          announcementSettings: {
                            ...currAnn,
                            enabled
                          }
                        });
                      }}
                      className="accent-[#AD647D] w-4 h-4"
                    />
                    <span className="font-bold">تفعيل الشريط</span>
                  </label>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F8DDE6] flex items-center justify-between gap-3">
                <div className="text-xs text-gray-700 truncate">
                  <span className="font-bold text-[#AD647D] ml-1.5">الرسالة الحالية:</span>
                  <span>
                    {settingsForm.announcementSettings?.messages?.find(m => m.isActive)?.text || settingsForm.announcementText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('announcements')}
                  className="text-xs text-[#C9A46A] hover:underline font-bold shrink-0"
                >
                  تعديل الرسائل والألوان ⚙️
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="py-3 px-8 bg-[#AD647D] hover:bg-[#8C465F] text-white text-xs font-bold rounded-2xl shadow-md transition"
              >
                حفظ التغييرات في قاعدة البيانات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DEDICATED TAB: ANNOUNCEMENT BAR MANAGER */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#FFF0F4] text-[#AD647D]">
                  <Sparkles className="w-5 h-5 text-[#C9A46A]" />
                </span>
                <h3 className="text-base font-bold text-[#2D141E]">
                  إدارة شريط الإعلانات الترويجي (Top Announcement Bar)
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                تخصيص كامل للنصوص المتحركة (Marquee)، تتابع الرسائل (Slideshow)، الألوان الملكية، وروابط الإجراء، مع حفظ فوري في Firebase.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {announcementSaveSuccess && (
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم الحفظ في Firebase Firestore بنجاح ✅</span>
                </div>
              )}

              <button
                type="button"
                disabled={isSavingAnnouncement}
                onClick={handleSaveAnnouncementSettings}
                className="py-3 px-6 bg-[#AD647D] hover:bg-[#8C465F] disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                {isSavingAnnouncement ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ الحفظ في السحابة...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>حفظ التعديلات في قاعدة البيانات</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Announcement Settings Manager Component */}
          <AnnouncementSettingsManager
            value={settingsForm.announcementSettings || DEFAULT_ANNOUNCEMENT_SETTINGS}
            onChange={(updated) => {
              const firstActiveText = updated.messages.find(m => m.isActive)?.text || settingsForm.announcementText;
              setSettingsForm({
                ...settingsForm,
                announcementSettings: updated,
                announcementActive: updated.enabled,
                announcementText: firstActiveText
              });
            }}
            products={products}
            categories={categories}
            coupons={coupons}
          />

          {/* Bottom Sticky-like Action Bar */}
          <div className="bg-white rounded-3xl border border-[#F8DDE6] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#AD647D]" />
              <span>
                التغييرات تنعكس فوراً في الوقت الفعلي عبر تقنية <strong>Firestore onSnapshot</strong> لجميع زوار المتجر.
              </span>
            </div>

            <button
              type="button"
              disabled={isSavingAnnouncement}
              onClick={handleSaveAnnouncementSettings}
              className="w-full sm:w-auto py-2.5 px-8 bg-[#AD647D] hover:bg-[#8C465F] disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSavingAnnouncement ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جارٍ الحفظ...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>حفظ إعدادات شريط الإعلانات الآن</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: REPORTS & EXPORT */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#2D141E]">التقرير المالي ومبيعات Flora Faten</h3>
                <p className="text-xs text-gray-400">حساب حقيقي مباشر من سجل طلبات المتجر</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-2 px-4 bg-[#FFF0F4] border border-[#F8DDE6] text-[#AD647D] rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة التقرير</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="py-2 px-4 bg-[#AD647D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير CSV</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl">
                <span className="text-xs text-gray-500">إجمالي الإيرادات المحصلة:</span>
                <div className="text-xl font-black text-[#AD647D] mt-1">{totalRevenue.toLocaleString()} ر.س</div>
              </div>
              <div className="p-4 bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl">
                <span className="text-xs text-gray-500">ضريبة القيمة المضافة التقديرية (15%):</span>
                <div className="text-xl font-black text-gray-700 mt-1">{Math.round(totalRevenue * 0.15).toLocaleString()} ر.س</div>
              </div>
              <div className="p-4 bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl">
                <span className="text-xs text-gray-500">صافي المبيعات قبل الضريبة:</span>
                <div className="text-xl font-black text-emerald-700 mt-1">{Math.round(totalRevenue / 1.15).toLocaleString()} ر.س</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: AFFILIATES & CREATORS MANAGEMENT */}
      {activeTab === 'affiliates' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs">
              <span className="text-xs text-gray-400 block">المسوقون المعتمدون</span>
              <div className="text-2xl font-black text-[#2D141E] mt-1">
                {affiliates.filter(a => a.status === 'approved').length}
              </div>
              <span className="text-[10px] text-gray-400">شريك و صانع محتوى</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs">
              <span className="text-xs text-gray-400 block">مبيعات الإحالات</span>
              <div className="text-2xl font-black text-[#AD647D] mt-1">
                {affiliates.reduce((sum, a) => sum + (a.totalSales || 0), 0).toLocaleString()} ر.س
              </div>
              <span className="text-[10px] text-gray-400">إجمالي المبيعات المحققة</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs">
              <span className="text-xs text-gray-400 block">إجمالي العمولات المكتسبة</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {affiliates.reduce((sum, a) => sum + (a.totalEarnings || 0), 0).toLocaleString()} ر.س
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">أرباح الشركاء</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#F8DDE6] shadow-xs">
              <span className="text-xs text-gray-400 block">طلبات السحب المعلقة</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ر.س
              </div>
              <span className="text-[10px] text-amber-600 font-bold">
                {payouts.filter(p => p.status === 'pending').length} طلب بانتظار التحويل
              </span>
            </div>
          </div>

          {/* Sub Navigation Strip */}
          <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F8DDE6] pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAffiliatesSubTab('active')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    affiliatesSubTab === 'active'
                      ? 'bg-[#AD647D] text-white shadow-xs'
                      : 'bg-[#FFF9FA] text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>المسوقون المعتمدون ({affiliates.filter(a => a.status === 'approved').length})</span>
                </button>

                <button
                  onClick={() => setAffiliatesSubTab('applications')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
                    affiliatesSubTab === 'applications'
                      ? 'bg-[#AD647D] text-white shadow-xs'
                      : 'bg-[#FFF9FA] text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>طلبات الانضمام ({affiliates.filter(a => a.status === 'pending').length})</span>
                  {affiliates.filter(a => a.status === 'pending').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </button>

                <button
                  onClick={() => setAffiliatesSubTab('payouts')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    affiliatesSubTab === 'payouts'
                      ? 'bg-[#AD647D] text-white shadow-xs'
                      : 'bg-[#FFF9FA] text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>طلبات السحب والتحويلات ({payouts.length})</span>
                </button>
              </div>

              <span className="text-[11px] text-gray-400">
                إدارة مركزية لصنّاع المحتوى وأكواد الخصم والعمولات
              </span>
            </div>

            {/* 1. ACTIVE AFFILIATES LIST */}
            {affiliatesSubTab === 'active' && (
              <div className="space-y-4">
                {affiliates.filter(a => a.status === 'approved').length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-[#F8DDE6] rounded-2xl">
                    لا يوجد مسوقون معتمدون حالياً. يمكنك قبول طلبات الانضمام من التبويب المجاور.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-[#FFF9FA] text-gray-500">
                          <th className="py-3 px-3 rounded-r-xl">المسوق / صانع المحتوى</th>
                          <th className="py-3 px-3">كود الخصم</th>
                          <th className="py-3 px-3">العمولة</th>
                          <th className="py-3 px-3">خصم المشتري</th>
                          <th className="py-3 px-3">النقرات</th>
                          <th className="py-3 px-3">الطلبات</th>
                          <th className="py-3 px-3">المبيعات</th>
                          <th className="py-3 px-3">الرصيد المتاح</th>
                          <th className="py-3 px-3 rounded-l-xl text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50">
                        {affiliates.filter(a => a.status === 'approved').map((aff) => (
                          <tr key={aff.id} className="hover:bg-[#FFFDFD]">
                            <td className="py-3 px-3">
                              <div className="font-bold text-[#2D141E]">{aff.name}</div>
                              <div className="text-[11px] text-gray-400">{aff.email} • {aff.phone}</div>
                              {aff.socialChannels && (
                                <div className="text-[10px] text-pink-600 mt-0.5 truncate max-w-xs">{aff.socialChannels}</div>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-[#AD647D] bg-pink-50 px-2 py-0.5 rounded-lg">
                                {aff.referralCode}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-gray-700">
                              {aff.commissionValue}{aff.commissionType === 'percentage' ? '%' : ' ر.س'}
                            </td>
                            <td className="py-3 px-3 font-semibold text-gray-600">
                              {aff.customerDiscountPercent || 10}%
                            </td>
                            <td className="py-3 px-3 text-gray-600">{aff.totalClicks || 0}</td>
                            <td className="py-3 px-3 font-bold text-[#AD647D]">{aff.totalOrders || 0}</td>
                            <td className="py-3 px-3 font-bold text-gray-800">{aff.totalSales || 0} ر.س</td>
                            <td className="py-3 px-3 font-black text-emerald-600">{aff.pendingBalance || 0} ر.س</td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => {
                                  setEditingAffiliateCommission(aff);
                                  setEditCommissionType(aff.commissionType || 'percentage');
                                  setEditCommissionValue(aff.commissionValue || 10);
                                  setEditDiscountValue(aff.customerDiscountPercent || 10);
                                }}
                                className="py-1 px-3 bg-[#FFF0F4] hover:bg-[#F8DDE6] text-[#AD647D] rounded-xl text-[11px] font-bold transition shadow-2xs"
                              >
                                تعديل العمولة
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. PENDING APPLICATIONS */}
            {affiliatesSubTab === 'applications' && (
              <div className="space-y-4">
                {affiliates.filter(a => a.status === 'pending').length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-[#F8DDE6] rounded-2xl">
                    لا توجد طلبات انضمام معلقة حالياً.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {affiliates.filter(a => a.status === 'pending').map((app) => (
                      <div key={app.id} className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-[#2D141E]">{app.name}</h4>
                            <span className="text-[11px] text-gray-400 block">{app.email} • {app.phone}</span>
                          </div>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            قيد المراجعة
                          </span>
                        </div>

                        <div className="text-xs space-y-1.5 text-gray-600 bg-white p-3 rounded-xl border border-pink-100">
                          <div><strong>القنوات الاجتماعية:</strong> {app.socialChannels}</div>
                          <div><strong>الكود المقترح:</strong> <span className="font-mono text-[#AD647D] font-bold">{app.referralCode}</span></div>
                          {app.bankName && (
                            <div><strong>الحساب البنكي:</strong> {app.bankName} - {app.iban} ({app.accountHolder})</div>
                          )}
                          {app.notes && <div><strong>ملاحظات المتقدم:</strong> {app.notes}</div>}
                          <div className="text-[10px] text-gray-400 pt-1">
                            تاريخ التقديم: {new Date(app.appliedAt).toLocaleDateString('ar-SA')}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedAffiliateForApproval(app);
                              setApprovalCode(app.referralCode || 'FLORA10');
                              setApprovalCommissionType('percentage');
                              setApprovalCommissionValue(10);
                              setApprovalDiscountValue(10);
                            }}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>قبول واعتماد الكود</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من رفض طلب ${app.name}؟`)) {
                                rejectAffiliate(app.id);
                              }
                            }}
                            className="py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition"
                          >
                            رفض
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PAYOUTS MANAGEMENT */}
            {affiliatesSubTab === 'payouts' && (
              <div className="space-y-4">
                {payouts.length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-[#F8DDE6] rounded-2xl">
                    لا توجد طلبات سحب أرباح مسجلة حتى الآن.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-[#FFF9FA] text-gray-500">
                          <th className="py-3 px-3 rounded-r-xl">المسوق</th>
                          <th className="py-3 px-3">المبلغ</th>
                          <th className="py-3 px-3">البنك والآيبان</th>
                          <th className="py-3 px-3">تاريخ الطلب</th>
                          <th className="py-3 px-3">الحالة</th>
                          <th className="py-3 px-3">مرجع التحويل</th>
                          <th className="py-3 px-3 rounded-l-xl text-center">إجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50">
                        {payouts.map((pay) => (
                          <tr key={pay.id} className="hover:bg-[#FFFDFD]">
                            <td className="py-3 px-3">
                              <div className="font-bold text-[#2D141E]">{pay.affiliateName}</div>
                              <div className="text-[11px] text-gray-400">{pay.affiliateEmail}</div>
                            </td>
                            <td className="py-3 px-3 font-black text-sm text-[#AD647D]">
                              {pay.amount} ر.س
                            </td>
                            <td className="py-3 px-3 text-gray-600">
                              <div>{pay.bankName} ({pay.accountHolder})</div>
                              <div className="font-mono text-[10px] text-gray-400">{pay.iban}</div>
                            </td>
                            <td className="py-3 px-3 text-gray-500">
                              {new Date(pay.requestedAt).toLocaleDateString('ar-SA')}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                pay.status === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : pay.status === 'rejected'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {pay.status === 'paid' ? 'تم التحويل' : pay.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-gray-500">
                              {pay.transactionReference || '—'}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {pay.status === 'pending' ? (
                                <button
                                  onClick={() => {
                                    setSelectedPayoutForProcessing(pay);
                                    setPayoutTransactionRef(`TRX-${Date.now().toString().slice(-6)}`);
                                    setPayoutAdminNotes('');
                                  }}
                                  className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-2xs transition"
                                >
                                  سداد واعتماد
                                </button>
                              ) : (
                                <span className="text-[11px] text-gray-400">مكتمل</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 10: USERS & RBAC MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 space-y-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F8DDE6] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#2D141E] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#AD647D]" />
                  <span>إدارة المستخدمين والصلاحيات ({allUsers.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  تحديد أدوار الحسابات: مالك المتجر، مدير النظام، موظف، مسوق بالعمولة، عميل
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="بحث بالاسم أو البريد..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-1.5 px-3 text-xs w-44"
                />

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-1.5 px-3 text-xs"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="owner">مالك المتجر</option>
                  <option value="admin">مدير النظام</option>
                  <option value="employee">موظف</option>
                  <option value="affiliate">مسوق / صانع محتوى</option>
                  <option value="customer">عميل</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#FFF9FA] text-gray-500">
                    <th className="py-3 px-3 rounded-r-xl">المستخدم</th>
                    <th className="py-3 px-3">البريد الإلكتروني</th>
                    <th className="py-3 px-3">رقم الجوال</th>
                    <th className="py-3 px-3">تاريخ الانضمام</th>
                    <th className="py-3 px-3">الدور والصلاحية</th>
                    <th className="py-3 px-3">الحالة</th>
                    <th className="py-3 px-3 rounded-l-xl text-center">تعديل الدور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {allUsers
                    .filter(u => {
                      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                      const matchSearch = !userSearchQuery || 
                        u.displayName?.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                        u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                      return matchRole && matchSearch;
                    })
                    .map((usr) => (
                      <tr key={usr.uid} className="hover:bg-[#FFFDFD]">
                        <td className="py-3 px-3 font-bold text-[#2D141E]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-pink-100 text-[#AD647D] flex items-center justify-center font-bold text-xs">
                              {(usr.displayName || 'ع')[0]}
                            </div>
                            <span>{usr.displayName || 'مستخدم بدون اسم'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600 font-mono text-[11px]">{usr.email}</td>
                        <td className="py-3 px-3 text-gray-500">{usr.phone || '—'}</td>
                        <td className="py-3 px-3 text-gray-400">
                          {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('ar-SA') : '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            usr.role === 'owner'
                              ? 'bg-purple-100 text-purple-800'
                              : usr.role === 'admin'
                              ? 'bg-[#C9A46A]/20 text-[#8B672E]'
                              : usr.role === 'affiliate'
                              ? 'bg-pink-100 text-[#AD647D]'
                              : usr.role === 'employee'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {usr.role === 'owner' ? 'مالك المتجر' : usr.role === 'admin' ? 'مدير النظام' : usr.role === 'affiliate' ? 'مسوق / صانع محتوى' : usr.role === 'employee' ? 'موظف' : 'عميل'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            usr.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {usr.status === 'suspended' ? 'موقوف' : 'نشط'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {usr.email?.toLowerCase() === 'floraf.aten1@gmail.com' ? (
                            <span className="text-[10px] text-gray-400 font-bold">حساب المالك الأساسي</span>
                          ) : (
                            <select
                              value={usr.role}
                              onChange={(e) => {
                                const newRole = e.target.value as UserRole;
                                updateUserRole(usr.uid, newRole);
                              }}
                              className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-1 px-2 text-xs focus:outline-hidden"
                            >
                              <option value="customer">عميل</option>
                              <option value="affiliate">مسوق / صانع محتوى</option>
                              <option value="employee">موظف</option>
                              <option value="admin">مدير النظام</option>
                              <option value="owner">مالك المتجر</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* APPROVE AFFILIATE MODAL */}
      {selectedAffiliateForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-[#F8DDE6]">
              <h3 className="font-bold text-base text-[#2D141E] flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>اعتماد طلب المسوق وتفعيل حسابه</span>
              </h3>
              <button onClick={() => setSelectedAffiliateForApproval(null)}>✕</button>
            </div>

            <div className="bg-[#FFF9FA] p-3 rounded-2xl text-xs space-y-1">
              <div><strong>المسوق:</strong> {selectedAffiliateForApproval.name}</div>
              <div><strong>البريد:</strong> {selectedAffiliateForApproval.email}</div>
              <div><strong>القنوات:</strong> {selectedAffiliateForApproval.socialChannels}</div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await approveAffiliate(
                  selectedAffiliateForApproval.id,
                  approvalCommissionType,
                  approvalCommissionValue,
                  approvalDiscountValue,
                  approvalCode
                );
                setSelectedAffiliateForApproval(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">كود الخصم المعتمد *</label>
                <input
                  type="text"
                  required
                  value={approvalCode}
                  onChange={(e) => setApprovalCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs font-mono font-bold uppercase focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">نوع العمولة</label>
                  <select
                    value={approvalCommissionType}
                    onChange={(e) => setApprovalCommissionType(e.target.value as any)}
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">قيمة العمولة للمسوق *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={approvalCommissionValue}
                    onChange={(e) => setApprovalCommissionValue(Number(e.target.value))}
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">نسبة الخصم لعملاء المسوق (%) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={approvalDiscountValue}
                  onChange={(e) => setApprovalDiscountValue(Number(e.target.value))}
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAffiliateForApproval(null)}
                  className="flex-1 py-2 border rounded-xl text-gray-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
                >
                  تأكيد الاعتماد والتفعيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT AFFILIATE COMMISSION MODAL */}
      {editingAffiliateCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-[#F8DDE6]">
              <h3 className="font-bold text-base text-[#2D141E]">
                تعديل عمولة: {editingAffiliateCommission.name}
              </h3>
              <button onClick={() => setEditingAffiliateCommission(null)}>✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateAffiliate(editingAffiliateCommission.id, {
                  commissionType: editCommissionType,
                  commissionValue: editCommissionValue,
                  customerDiscountPercent: editDiscountValue
                });
                setEditingAffiliateCommission(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">نوع العمولة</label>
                  <select
                    value={editCommissionType}
                    onChange={(e) => setEditCommissionType(e.target.value as any)}
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">قيمة العمولة للمسوق</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editCommissionValue}
                    onChange={(e) => setEditCommissionValue(Number(e.target.value))}
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">نسبة الخصم للمشتري (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={editDiscountValue}
                  onChange={(e) => setEditDiscountValue(Number(e.target.value))}
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAffiliateCommission(null)}
                  className="flex-1 py-2 border rounded-xl text-gray-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl font-bold shadow-xs transition"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROCESS PAYOUT MODAL */}
      {selectedPayoutForProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-[#F8DDE6]">
              <h3 className="font-bold text-base text-[#2D141E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>سداد طلب التحويل البنكي للمسوق</span>
              </h3>
              <button onClick={() => setSelectedPayoutForProcessing(null)}>✕</button>
            </div>

            <div className="bg-[#FFF9FA] p-3 rounded-2xl text-xs space-y-1">
              <div><strong>المسوق:</strong> {selectedPayoutForProcessing.affiliateName}</div>
              <div><strong>المبلغ:</strong> <span className="text-base font-black text-emerald-600">{selectedPayoutForProcessing.amount} ر.س</span></div>
              <div><strong>البنك:</strong> {selectedPayoutForProcessing.bankName}</div>
              <div><strong>المستفيد:</strong> {selectedPayoutForProcessing.accountHolder}</div>
              <div className="font-mono text-[11px] text-gray-700"><strong>IBAN:</strong> {selectedPayoutForProcessing.iban}</div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await processPayout(
                  selectedPayoutForProcessing.id,
                  'paid',
                  payoutAdminNotes,
                  payoutTransactionRef
                );
                setSelectedPayoutForProcessing(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">رقم مرجع التحويل البنكي *</label>
                <input
                  type="text"
                  required
                  value={payoutTransactionRef}
                  onChange={(e) => setPayoutTransactionRef(e.target.value)}
                  placeholder="مثال: TRX-RAJ-123456"
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ملاحظات التحويل</label>
                <textarea
                  rows={2}
                  value={payoutAdminNotes}
                  onChange={(e) => setPayoutAdminNotes(e.target.value)}
                  placeholder="تم التحويل عبر الحساب البنكي الرسمي للمتجر..."
                  className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayoutForProcessing(null)}
                  className="flex-1 py-2 border rounded-xl text-gray-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
                >
                  تأكيد تسجيل السداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-pink-100">
              <h3 className="font-bold text-sm text-[#2D141E]">
                {editingProduct.id ? 'تعديل منتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم الباقة أو المنتج *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">السعر الأساسي (ر.س) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">سعر التخفيض (اختياري)</label>
                  <input
                    type="number"
                    value={editingProduct.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">التصنيف *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">نوع الورد *</label>
                  <select
                    value={editingProduct.flowerType || 'natural'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, flowerType: e.target.value as any })}
                    className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                  >
                    <option value="natural">طبيعي هولندي</option>
                    <option value="artificial">صناعي فاخر دائم</option>
                    <option value="mix">تنسيق مدمج</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">المخزون المتوفر</label>
                <input
                  type="number"
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">رابط الصورة الرئيسية</label>
                <input
                  type="url"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border border-[#F8DDE6] rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#AD647D]"
                  />
                  <span>عرض في الصفحة الرئيسية (مميز)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="accent-[#AD647D]"
                  />
                  <span>الأكثر طلباً</span>
                </label>
              </div>

              <div className="pt-3 border-t border-pink-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#AD647D] text-white rounded-xl font-bold"
                >
                  حفظ في قاعدة البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-sm">إضافة / تعديل تصنيف</h3>
            <form onSubmit={handleSaveCategorySubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="اسم التصنيف بالعربية (مثال: بوكسات العيد)"
                value={editingCategory.name || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full border rounded-xl p-2.5"
              />
              <input
                type="text"
                required
                placeholder="الاسم اللطيف بالإنجليزية (slug مثال: eid-boxes)"
                value={editingCategory.slug || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                className="w-full border rounded-xl p-2.5"
              />
              <input
                type="url"
                placeholder="رابط الصورة"
                value={editingCategory.image || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                className="w-full border rounded-xl p-2.5"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-3 py-1.5 border rounded-xl">إلغاء</button>
                <button type="submit" className="px-4 py-1.5 bg-[#AD647D] text-white rounded-xl font-bold">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {isCouponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-sm">إضافة كود خصم جديد</h3>
            <form onSubmit={handleSaveCouponSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="كود الخصم (مثال: SPRING20)"
                value={editingCoupon.code || ''}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                className="w-full border rounded-xl p-2.5 uppercase font-mono"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editingCoupon.discountType}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}
                  className="border rounded-xl p-2.5"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ر.س)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="القيمة"
                  value={editingCoupon.discountValue || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                  className="border rounded-xl p-2.5"
                />
              </div>
              <input
                type="number"
                placeholder="الحد الأدنى للطلب (ر.س)"
                value={editingCoupon.minOrderAmount || 100}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: Number(e.target.value) })}
                className="w-full border rounded-xl p-2.5"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-3 py-1.5 border rounded-xl">إلغاء</button>
                <button type="submit" className="px-4 py-1.5 bg-[#AD647D] text-white rounded-xl font-bold">حفظ الكود</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE PRINT MODAL */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full space-y-6 shadow-2xl border border-[#F8DDE6]">
            <div className="flex justify-between items-start pb-4 border-b border-[#F8DDE6]">
              <div>
                <h2 className="text-xl font-bold font-serif-lux text-[#AD647D]">Flora Faten | فلورا فاتن</h2>
                <span className="text-[11px] text-gray-500">فاتورة ضريبية مبسطة • Simplified Tax Invoice</span>
                <div className="text-[10px] text-gray-400 mt-0.5">الرقم الضريبي: {settings.taxNumber}</div>
              </div>
              <button onClick={() => setSelectedOrderForInvoice(null)} className="no-print text-gray-400">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">رقم الفاتورة:</span>
                <span className="font-mono font-bold">{selectedOrderForInvoice.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-400 block">تاريخ الإصدار:</span>
                <span>{new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('ar-SA')}</span>
              </div>
              <div>
                <span className="text-gray-400 block">العميل:</span>
                <span className="font-bold">{selectedOrderForInvoice.customerName}</span>
                <span className="block text-[10px] text-gray-500">{selectedOrderForInvoice.customerPhone}</span>
              </div>
              <div>
                <span className="text-gray-400 block">العنوان:</span>
                <span>{selectedOrderForInvoice.deliveryCity} - {selectedOrderForInvoice.deliveryDistrict}</span>
              </div>
            </div>

            {/* Line items */}
            <div className="border border-[#F8DDE6] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#FFF9FA] border-b border-pink-100">
                  <tr>
                    <th className="p-2.5">الوصف</th>
                    <th className="p-2.5">الكمية</th>
                    <th className="p-2.5">السعر</th>
                    <th className="p-2.5">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {selectedOrderForInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold">{it.name}</td>
                      <td className="p-2.5">{it.quantity}</td>
                      <td className="p-2.5">{it.unitPrice} ر.س</td>
                      <td className="p-2.5 font-bold">{it.itemTotal} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card message note if any */}
            {selectedOrderForInvoice.giftCardMessage && (
              <div className="p-3 bg-[#FFF9FA] rounded-xl border border-dashed border-[#C9A46A] text-xs">
                <span className="font-bold text-[#AD647D] block mb-0.5">نص كرت الإهداء المرفق:</span>
                <span className="italic">"{selectedOrderForInvoice.giftCardMessage}"</span>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-right pt-2 border-t border-pink-100">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{selectedOrderForInvoice.subtotal} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span>{selectedOrderForInvoice.deliveryFee} ر.س</span>
              </div>
              {selectedOrderForInvoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>الخصم:</span>
                  <span>-{selectedOrderForInvoice.discountAmount} ر.س</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#AD647D] pt-2 border-t border-[#F8DDE6]">
                <span>المبلغ الإجمالي النهائي:</span>
                <span>{selectedOrderForInvoice.total} ر.س</span>
              </div>
              <div className="text-[10px] text-gray-400 text-center pt-2">
                الأسعار تشمل ضريبة القيمة المضافة 15% • شكراً لاختياركم Flora Faten 🌸
              </div>
            </div>

            <div className="no-print pt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2 border rounded-xl text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#AD647D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الفاتورة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STOCK ALERT CENTER MODAL */}
      {showStockAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#F8DDE6] w-full max-w-2xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md animate-pulse">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#2D141E]">
                    مركز تنبيهات المخزون والتزويد السريع
                  </h3>
                  <p className="text-xs text-gray-400">
                    مراقبة وإعادة شحن المنتجات التي اقتربت من النفاد في متجر فلورا فاتن
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowStockAlertModal(false)}
                className="p-2 rounded-full hover:bg-pink-50 text-gray-400 hover:text-[#AD647D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Threshold & Count Settings */}
            <div className="bg-[#FFF9FA] border border-[#F8DDE6] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#AD647D] block">حد احتساب المخزون منخفضاً:</span>
                <span className="text-[11px] text-gray-500">يتم إطلاق التنبيه المرئي عند وصول المخزون لهذه الكمية أو أقل</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-[#F8DDE6] p-1.5 rounded-xl">
                {[3, 5, 8, 10, 15].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLowStockThreshold(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      lowStockThreshold === val
                        ? 'bg-[#AD647D] text-white shadow-2xs'
                        : 'text-gray-500 hover:text-[#AD647D]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert List */}
            {allAlertProducts.length === 0 ? (
              <div className="py-12 text-center text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">مخزون جميع المنتجات ممتاز!</h4>
                <p className="text-xs text-emerald-600">
                  لا توجد باقات أو هدايا يقل مخزونها عن {lowStockThreshold} قطع حالياً.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 px-1">
                  <span>المنتجات التي تتطلب إعادة شحن ({allAlertProducts.length}):</span>
                  <span className="text-[11px] text-amber-700">اضغط على زر الإضافة لتحديث المخزون لحظياً</span>
                </div>

                <div className="divide-y divide-pink-50 border border-[#F8DDE6] rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
                  {allAlertProducts.map((p) => {
                    const isZero = p.stock === 0;

                    return (
                      <div
                        key={p.id}
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
                          isZero ? 'bg-red-50/50' : 'bg-white hover:bg-pink-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#F8DDE6] shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[#2D141E] text-xs">{p.name}</div>
                            <div className="text-[11px] text-gray-400">{p.categoryName} • {p.price} ر.س</div>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  isZero
                                    ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {isZero ? '⚠️ نفد بالكامل (0 قطع)' : `⚠️ متبقي ${p.stock} فقط`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Restock Buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <span className="text-[10px] text-gray-400 ml-1">إضافة:</span>
                          <button
                            type="button"
                            onClick={() => handleQuickRestock(p, 5)}
                            className="py-1 px-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-bold text-[11px] transition shadow-2xs"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickRestock(p, 10)}
                            className="py-1 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-bold text-[11px] transition shadow-2xs"
                          >
                            +10 قطع
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickRestock(p, 25)}
                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition shadow-2xs"
                          >
                            +25 قطعة
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                يتم حفظ جميع التحديثات فوراً في قاعدة بيانات Firestore المركزية
              </span>
              <button
                onClick={() => setShowStockAlertModal(false)}
                className="py-2 px-5 bg-[#AD647D] text-white rounded-xl text-xs font-bold transition hover:bg-[#8C465F]"
              >
                تم الإغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
