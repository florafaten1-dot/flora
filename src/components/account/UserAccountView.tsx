import React, { useState } from 'react';
import { 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  ShoppingBag, 
  ShieldCheck, 
  Compass, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Edit2,
  Save,
  Share2,
  Percent,
  Check,
  Send,
  UserPlus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AffiliatePortalView } from '../affiliate/AffiliatePortalView';

interface UserAccountViewProps {
  onNavigate: (tab: string) => void;
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    userProfile, 
    isOwner,
    isAdmin, 
    isStaff, 
    isAffiliate,
    isDemoAdmin, 
    setDemoAdminMode,
    loginWithGoogle, 
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset,
    sendEmailVerificationLink,
    logout, 
    orders, 
    updateUserProfile,
    currentAffiliateProfile
  } = useStore();

  // Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Subtab for logged in user: 'orders' | 'affiliate' | 'profile'
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'affiliate' | 'profile'>('orders');

  // Friendly Arabic Error mapper
  const mapAuthError = (err: any): string => {
    const code = err.code || err.message || '';
    if (code.includes('invalid-email')) return 'صيغة البريد الإلكتروني المدخل غير صحيحة.';
    if (code.includes('user-not-found')) return 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
    if (code.includes('wrong-password') || code.includes('invalid-credential')) {
      return 'بيانات تسجيل الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.';
    }
    if (code.includes('email-already-in-use')) return 'البريد الإلكتروني مسجل بالفعل بحساب آخر.';
    if (code.includes('weak-password')) return 'كلمة المرور ضعيفة، يجب أن تتكون من 6 خانات على الأقل.';
    if (code.includes('popup-closed-by-user')) return 'تم إلغاء تسجيل الدخول عبر Google قبل إكماله.';
    if (code.includes('popup-blocked')) return 'تم حظر النافذة المنبثقة من قبل المتصفح، يرجى السماح بها أو الدخول بالبريد.';
    if (code.includes('network-request-failed')) return 'تعذر الاتصال بالشبكة، يرجى التحقق من اتصالك بالإنترنت.';
    return err.message || 'حدث خطأ أثناء المصادقة، يرجى المحاولة لاحقاً.';
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
      setAuthSuccess('تم تسجيل الدخول بنجاح عبر حساب Google!');
    } catch (e: any) {
      setAuthError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  // Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await loginWithEmail(loginEmail, loginPassword, rememberMe);
      setAuthSuccess('تم تسجيل الدخول بنجاح! مرحباً بك في Flora Faten');
    } catch (e: any) {
      setAuthError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('كلمتا المرور غير متطابقتين، يرجى التأكد وإعادة الكتابة');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('يجب أن تحتوي كلمة المرور على 6 أحرف أو أرقام على الأقل');
      return;
    }
    if (!agreeTerms) {
      setAuthError('يرجى الموافقة على الشروط وسياسة الخصوصية للمتابعة');
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      await registerWithEmail(regEmail, regPassword, regFullName, regPhone);
      setAuthSuccess('تم إنشاء حسابك بنجاح! مرحباً بك كعضو في Flora Faten');
    } catch (e: any) {
      setAuthError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setAuthError('يرجى كتابة البريد الإلكتروني لاستعادة كلمة المرور');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await sendPasswordReset(forgotEmail);
      setAuthSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح!');
      setTimeout(() => {
        setAuthMode('login');
      }, 4000);
    } catch (e: any) {
      setAuthError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateUserProfile({
        displayName: editName.trim(),
        phone: editPhone.trim()
      });
      setIsEditingProfile(false);
    } catch (e: any) {
      alert('حدث خطأ أثناء حفظ الملف الشخصي');
    } finally {
      setSavingProfile(false);
    }
  };

  // User orders
  const userOrders = currentUser 
    ? orders.filter(o => o.userId === currentUser.uid || (currentUser.email && o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()))
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn space-y-6 sm:space-y-8 overflow-hidden">
      
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#2D141E] font-serif-lux">
          {currentUser ? 'حسابي ولوحة الخدمات' : 'تسجيل الدخول وحسابات Flora Faten'}
        </h1>
        <p className="text-xs text-gray-500">
          {currentUser 
            ? 'إدارة الحساب، الطلبات، وبوابة التسويق بالعمولة وصنّاع المحتوى'
            : 'سجل الدخول أو أنشئ حساباً لمتابعة طلباتك والانضمام لبرنامج شركاء النجاح'}
        </p>
      </div>

      {/* Main Account Card */}
      <div className="bg-white rounded-3xl border border-[#F8DDE6] p-6 sm:p-8 shadow-xs">
        
        {currentUser ? (
          /* ================= LOGGED IN DASHBOARD ================= */
          <div className="space-y-6">
            
            {/* Top User Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#F8DDE6] gap-4 text-center sm:text-right">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E7A0B4] to-[#AD647D] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-[#C9A46A]">
                  {(userProfile?.displayName || currentUser.displayName || 'ف')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="font-bold text-base text-[#2D141E]">
                      {userProfile?.displayName || currentUser.displayName || 'عميل فلورا فاتن'}
                    </h3>
                    
                    {/* Role Badges */}
                    {isOwner ? (
                      <span className="bg-[#AD647D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-[#FFE680]" /> مالك المتجر
                      </span>
                    ) : isAdmin ? (
                      <span className="bg-[#C9A46A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> مدير النظام
                      </span>
                    ) : isAffiliate ? (
                      <span className="bg-pink-100 text-[#AD647D] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C9A46A]" /> صانع محتوى / مسوق
                      </span>
                    ) : (
                      <span className="bg-[#FFF0F4] text-[#AD647D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        عميل مميز
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 justify-center sm:justify-start">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentUser.email}</span>
                    {currentUser.emailVerified ? (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> موثق
                      </span>
                    ) : (
                      <button
                        onClick={sendEmailVerificationLink}
                        className="text-[10px] text-[#AD647D] underline hover:text-[#8C465F]"
                        title="إرسال رابط التحقق"
                      >
                        (تأكيد البريد)
                      </button>
                    )}
                  </div>

                  {userProfile?.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 justify-center sm:justify-start">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{userProfile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isStaff && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="py-2.5 px-4 bg-[#C9A46A] hover:bg-[#B38F56] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>لوحة التحكم الإدارية</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="py-2.5 px-4 border border-[#F8DDE6] hover:bg-pink-50 text-red-500 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#F8DDE6] pb-3 text-xs font-bold">
              <button
                onClick={() => setActiveSubTab('orders')}
                className={`py-2 px-4 rounded-xl transition flex items-center gap-1.5 ${
                  activeSubTab === 'orders'
                    ? 'bg-[#AD647D] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-pink-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>طلباتي السابقة ({userOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('affiliate')}
                className={`py-2 px-4 rounded-xl transition flex items-center gap-1.5 ${
                  activeSubTab === 'affiliate'
                    ? 'bg-[#AD647D] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-pink-50'
                }`}
              >
                <Share2 className="w-4 h-4 text-[#C9A46A]" />
                <span>التسويق بالعمولة وصنّاع المحتوى</span>
                {currentAffiliateProfile?.status === 'approved' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('profile');
                  setEditName(userProfile?.displayName || currentUser.displayName || '');
                  setEditPhone(userProfile?.phone || '');
                }}
                className={`py-2 px-4 rounded-xl transition flex items-center gap-1.5 ${
                  activeSubTab === 'profile'
                    ? 'bg-[#AD647D] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-pink-50'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>البيانات الشخصية</span>
              </button>
            </div>

            {/* Sub-Tab 1: Past Orders */}
            {activeSubTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="p-8 bg-[#FFF9FA] rounded-2xl border border-dashed border-[#F8DDE6] text-center text-xs text-gray-500">
                    لا توجد طلبات مسجلة بهذا الحساب حتى الآن.
                    <div className="mt-3">
                      <button
                        onClick={() => onNavigate('products')}
                        className="py-2 px-5 bg-[#AD647D] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition"
                      >
                        تصفح باقات الورد وابدأ طلبك الآن
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-pink-50 border border-[#F8DDE6] rounded-2xl overflow-hidden">
                    {userOrders.map((ord) => (
                      <div key={ord.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:bg-[#FFFDFD]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#AD647D]">{ord.orderNumber}</span>
                            {ord.affiliateCode && (
                              <span className="bg-pink-50 text-[#AD647D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                كود: {ord.affiliateCode}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString('ar-SA')} • {ord.deliveryCity} ({ord.deliveryDistrict})
                          </div>
                          <div className="text-[11px] text-gray-600 mt-1">
                            {ord.items.map(i => i.name).join('، ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-sm text-[#AD647D]">{ord.total} ر.س</span>
                          <span className="bg-[#FFF0F4] text-[#AD647D] px-2.5 py-1 rounded-full text-[10px] font-bold">
                            {ord.status}
                          </span>
                          <button
                            onClick={() => onNavigate('tracking')}
                            className="p-1.5 text-gray-400 hover:text-[#AD647D] transition"
                            title="تتبع الشحنة"
                          >
                            <Compass className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 2: Affiliate & Creator Portal */}
            {activeSubTab === 'affiliate' && (
              <AffiliatePortalView onNavigate={onNavigate} />
            )}

            {/* Sub-Tab 3: Edit Profile */}
            {activeSubTab === 'profile' && (
              <div className="bg-[#FFF9FA] border border-[#F8DDE6] rounded-2xl p-6 space-y-4 max-w-lg">
                <h4 className="font-bold text-sm text-[#2D141E]">تعديل البيانات الشخصية</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.email || ''}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">رقم الجوال (السعودية)</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full bg-white border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="py-2.5 px-6 bg-[#AD647D] hover:bg-[#8C465F] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingProfile ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ================= NOT LOGGED IN FORMS ================= */
          <div className="max-w-md mx-auto space-y-6">

            {/* Auth Mode Switcher */}
            <div className="flex bg-[#FFF0F4] p-1 rounded-2xl text-xs font-bold text-center">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 rounded-xl transition ${
                  authMode === 'login' ? 'bg-white text-[#AD647D] shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 rounded-xl transition ${
                  authMode === 'register' ? 'bg-white text-[#AD647D] shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                إنشاء حساب جديد
              </button>
            </div>

            {/* Error & Success Alerts */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'جاري الاتصال...' : 'الدخول السريع عبر Google OAuth'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-gray-400 absolute">أو عبر البريد الإلكتروني</span>
            </div>

            {/* 1. LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden focus:border-[#AD647D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 pr-3 pl-9 text-xs focus:outline-hidden focus:border-[#AD647D]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#AD647D]"
                    />
                    <span>تذكرني في هذه الجلسة</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccess(null); }}
                    className="text-[#AD647D] hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#AD647D] hover:bg-[#8C465F] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
                </button>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">رقم الجوال (اختياري)</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">كلمة المرور *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">تأكيد كلمة المرور *</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="أعد كتابتها"
                      className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2 px-3 text-xs focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1 text-[11px] text-gray-600">
                  <input
                    type="checkbox"
                    id="regTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#AD647D]"
                  />
                  <label htmlFor="regTerms" className="cursor-pointer select-none leading-relaxed">
                    أوافق على <span className="text-[#AD647D] underline">الشروط والأحكام</span> و<span className="text-[#AD647D] underline">سياسة الخصوصية</span> لمتجر Flora Faten.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#AD647D] hover:bg-[#8C465F] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}</span>
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <KeyRound className="w-8 h-8 text-[#AD647D] mx-auto" />
                  <h4 className="font-bold text-sm text-[#2D141E]">استعادة كلمة المرور</h4>
                  <p className="text-[11px] text-gray-500">
                    أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور فوراً.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FFF9FA] border border-[#F8DDE6] rounded-xl py-2.5 px-3 text-xs focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#AD647D] hover:bg-[#8C465F] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال رابط استعادة كلمة المرور'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className="text-[11px] text-[#AD647D] hover:underline"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Access Bar */}
            <div className="pt-6 border-t border-[#F8DDE6] space-y-3">
              <span className="text-[11px] font-bold text-gray-500 block text-center">
                ⭐ للتقييم والتجربة الفورية للوحة الإدارة:
              </span>
              <button
                type="button"
                onClick={() => {
                  setDemoAdminMode(!isDemoAdmin);
                  onNavigate('admin');
                }}
                className="w-full py-2.5 px-4 bg-[#FFF8E7] hover:bg-[#C9A46A] hover:text-white text-[#9A7432] border border-[#C9A46A] rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>الدخول الفوري إلى لوحة تحكم الإدارة (وضع المسؤول)</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
