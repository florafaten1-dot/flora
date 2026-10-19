/**
 * Automated Security Rules Verification Suite
 * Tests exact rules logic for Unregistered, Customer, and Staff / Admin contexts.
 */

interface SecurityContext {
  auth: {
    uid: string;
    token: {
      email?: string;
    };
  } | null;
}

interface FirestoreState {
  users: Record<string, { role: string; email: string }>;
  products: Record<string, { name: string; price: number; stock: number; updatedAt: string }>;
  orders: Record<string, any>;
  storeSettings: Record<string, any>;
}

// Security Rules Evaluator mirroring firestore.rules
class FirestoreRulesSimulator {
  private state: FirestoreState;

  constructor(initialState: FirestoreState) {
    this.state = JSON.parse(JSON.stringify(initialState));
  }

  private isSuperAdmin(ctx: SecurityContext): boolean {
    return ctx.auth !== null && (ctx.auth.token.email?.toLowerCase() === 'floraf.aten1@gmail.com');
  }

  private isStaff(ctx: SecurityContext): boolean {
    if (this.isSuperAdmin(ctx)) return true;
    if (!ctx.auth) return false;
    const userDoc = this.state.users[ctx.auth.uid];
    return !!userDoc && ['owner', 'admin', 'employee'].includes(userDoc.role);
  }

  // 1. Settings
  canReadSettings(): boolean {
    return true;
  }
  canWriteSettings(ctx: SecurityContext): boolean {
    return this.isStaff(ctx) || this.isSuperAdmin(ctx);
  }

  // 2. Products
  canReadProducts(): boolean {
    return true;
  }
  canCreateProduct(ctx: SecurityContext): boolean {
    return this.isStaff(ctx);
  }
  canDeleteProduct(ctx: SecurityContext): boolean {
    return this.isStaff(ctx);
  }
  canUpdateProduct(ctx: SecurityContext, productId: string, nextData: any): boolean {
    if (this.isStaff(ctx)) return true;
    const current = this.state.products[productId];
    if (!current) return false;

    // Check affected keys
    const currentKeys = Object.keys(current);
    const nextKeys = Object.keys(nextData);
    const changedKeys = nextKeys.filter(k => (current as any)[k] !== nextData[k]);
    const onlyStockAndUpdated = changedKeys.every(k => k === 'stock' || k === 'updatedAt');
    if (!onlyStockAndUpdated) return false;

    // Must be int, >= 0, and <= current
    if (typeof nextData.stock !== 'number' || !Number.isInteger(nextData.stock)) return false;
    if (nextData.stock < 0) return false;
    if (nextData.stock > current.stock) return false;

    return true;
  }

  // 6. Orders
  canCreateOrder(ctx: SecurityContext, orderData: any): boolean {
    if (typeof orderData.customerName !== 'string' || orderData.customerName.length < 2) return false;
    if (typeof orderData.customerPhone !== 'string' || orderData.customerPhone.length < 9) return false;
    if (typeof orderData.deliveryCity !== 'string' || !orderData.deliveryCity.includes('مكة')) return false;
    if (typeof orderData.deliveryDistrict !== 'string' || orderData.deliveryDistrict.length < 2) return false;
    if (typeof orderData.deliveryAddress !== 'string' || orderData.deliveryAddress.length < 3) return false;
    if (typeof orderData.subtotal !== 'number' || orderData.subtotal < 50) return false;
    if (typeof orderData.total !== 'number' || orderData.total < 50) return false;
    if (!['new', 'pending_payment'].includes(orderData.status)) return false;
    if (!['unpaid', 'pending'].includes(orderData.paymentStatus)) return false;
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) return false;
    if (ctx.auth !== null && orderData.userId && orderData.userId !== ctx.auth.uid) return false;
    return true;
  }

  canListOrders(ctx: SecurityContext): boolean {
    return this.isStaff(ctx);
  }

  canGetOrder(ctx: SecurityContext, orderId: string): boolean {
    if (this.isStaff(ctx)) return true;
    const order = this.state.orders[orderId];
    if (!order) return false;
    if (ctx.auth !== null && order.userId === ctx.auth.uid) return true;
    return false;
  }

  canUpdateOrder(ctx: SecurityContext): boolean {
    return this.isStaff(ctx);
  }

  canDeleteOrder(ctx: SecurityContext): boolean {
    return this.isStaff(ctx);
  }

  // 8. Users
  canCreateUser(ctx: SecurityContext, userId: string, userData: any): boolean {
    if (!ctx.auth || ctx.auth.uid !== userId) return false;
    if (this.isSuperAdmin(ctx)) return true;
    if (!userData.role || userData.role === 'customer') return true;
    return false;
  }

  canUpdateUser(ctx: SecurityContext, userId: string, nextData: any): boolean {
    if (this.isSuperAdmin(ctx)) return true;
    if (this.isStaff(ctx) && nextData.role !== 'owner') return true;
    if (ctx.auth && ctx.auth.uid === userId) {
      const current = this.state.users[userId];
      if (!userDataHasRoleElevation(current?.role, nextData.role)) {
        return true;
      }
    }
    return false;
  }
}

function userDataHasRoleElevation(currentRole: string | undefined, nextRole: string | undefined): boolean {
  if (!nextRole || nextRole === currentRole) return false;
  if (currentRole === 'customer' && nextRole === 'customer') return false;
  return true;
}

// Storage Evaluator
class StorageRulesSimulator {
  canRead(): boolean {
    return true;
  }
  canWrite(ctx: SecurityContext, fileSize: number, mimeType: string): boolean {
    const isSuper = ctx.auth !== null && ctx.auth.token.email?.toLowerCase() === 'floraf.aten1@gmail.com';
    if (!isSuper) return false;
    if (fileSize > 10 * 1024 * 1024) return false;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    return allowed.includes(mimeType);
  }
}

// --- TEST EXECUTION ---
let passCount = 0;
let failCount = 0;

function test(name: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${name}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('🛡️  FLORA FATEN FIRESTORE & STORAGE SECURITY RULES AUDIT');
console.log('====================================================\n');

const mockState: FirestoreState = {
  users: {
    'admin_owner': { role: 'owner', email: 'floraf.aten1@gmail.com' },
    'staff_emp': { role: 'employee', email: 'staff@florafaten.store' },
    'cust_123': { role: 'customer', email: 'cust1@example.com' },
    'cust_456': { role: 'customer', email: 'cust2@example.com' },
  },
  products: {
    'prod_red_roses': { name: 'باقة الورد الأحمر', price: 160, stock: 5, updatedAt: '2026-10-19T00:00:00Z' }
  },
  orders: {
    'ord_1': { id: 'ord_1', userId: 'cust_123', total: 160, customerName: 'فاطمة', deliveryCity: 'مكة المكرمة' },
    'ord_2': { id: 'ord_2', userId: 'cust_456', total: 220, customerName: 'سارة', deliveryCity: 'مكة المكرمة' }
  },
  storeSettings: {
    'general': { storeName: 'Flora Faten' }
  }
};

const fsSim = new FirestoreRulesSimulator(mockState);
const storageSim = new StorageRulesSimulator();

const unauthenticatedCtx: SecurityContext = { auth: null };
const customerCtx: SecurityContext = { auth: { uid: 'cust_123', token: { email: 'cust1@example.com' } } };
const customer2Ctx: SecurityContext = { auth: { uid: 'cust_456', token: { email: 'cust2@example.com' } } };
const superAdminCtx: SecurityContext = { auth: { uid: 'admin_owner', token: { email: 'floraf.aten1@gmail.com' } } };

// --- SUITE 1: Unregistered (Guest) Access Tests ---
console.log('--- 1. Unregistered (Guest) Security Tests ---');
test('1.1 Guest CANNOT list all orders (Blocked)', fsSim.canListOrders(unauthenticatedCtx) === false);
test('1.2 Guest CANNOT read order ord_1 by ID (Blocked)', fsSim.canGetOrder(unauthenticatedCtx, 'ord_1') === false);
test('1.3 Guest CAN read public store settings (Allowed)', fsSim.canReadSettings() === true);
test('1.4 Guest CAN read catalog products (Allowed)', fsSim.canReadProducts() === true);
test('1.5 Guest CANNOT update product prices (Blocked)', fsSim.canUpdateProduct(unauthenticatedCtx, 'prod_red_roses', { stock: 5, price: 50, updatedAt: 'now' }) === false);
test('1.6 Guest CANNOT delete a product (Blocked)', fsSim.canDeleteProduct(unauthenticatedCtx) === false);
test('1.7 Guest CANNOT self-create user profile as admin (Blocked)', fsSim.canCreateUser(unauthenticatedCtx, 'attacker', { role: 'admin' }) === false);

// --- SUITE 2: Order Creation & Constraints Validation ---
console.log('\n--- 2. Order Creation & Tampering Validation ---');
const validMakkahOrder = {
  customerName: 'نورة العتيبي',
  customerPhone: '0551122334',
  deliveryCity: 'مكة المكرمة - حي العوالي',
  deliveryDistrict: 'حي العوالي',
  deliveryAddress: 'شارع إبراهيم الجفالي أمام بنك الراجحي',
  subtotal: 160,
  total: 160,
  status: 'new',
  paymentStatus: 'unpaid',
  items: [{ productId: 'prod_red_roses', quantity: 1, unitPrice: 160 }]
};
test('2.1 Valid Makkah order >= 50 SAR is ACCEPTED', fsSim.canCreateOrder(unauthenticatedCtx, validMakkahOrder) === true);

const jeddahOrder = { ...validMakkahOrder, deliveryCity: 'جدة - حي الحمراء' };
test('2.2 Order with Jeddah deliveryCity is REJECTED', fsSim.canCreateOrder(unauthenticatedCtx, jeddahOrder) === false);

const riyadhOrder = { ...validMakkahOrder, deliveryCity: 'الرياض - حي النرجس' };
test('2.3 Order with Riyadh deliveryCity is REJECTED', fsSim.canCreateOrder(unauthenticatedCtx, riyadhOrder) === false);

const underMinOrder = { ...validMakkahOrder, subtotal: 35, total: 35 };
test('2.4 Order under 50 SAR minimum threshold is REJECTED', fsSim.canCreateOrder(unauthenticatedCtx, underMinOrder) === false);

const tamperedStatusOrder = { ...validMakkahOrder, status: 'completed' };
test('2.5 Creating order directly with status "completed" is REJECTED', fsSim.canCreateOrder(unauthenticatedCtx, tamperedStatusOrder) === false);

const emptyItemsOrder = { ...validMakkahOrder, items: [] };
test('2.6 Order with empty items list is REJECTED', fsSim.canCreateOrder(unauthenticatedCtx, emptyItemsOrder) === false);

// --- SUITE 3: Stock Reduction & Transaction Rules ---
console.log('\n--- 3. Direct Firestore Stock Tampering Tests ---');
const stockDecrement = { name: 'باقة الورد الأحمر', price: 160, stock: 4, updatedAt: '2026-10-19T01:00:00Z' };
test('3.1 Atomic stock decrement (5 -> 4) during order is ALLOWED', fsSim.canUpdateProduct(unauthenticatedCtx, 'prod_red_roses', stockDecrement) === true);

const stockIncrement = { name: 'باقة الورد الأحمر', price: 160, stock: 10, updatedAt: '2026-10-19T01:00:00Z' };
test('3.2 Direct stock increase by non-staff (5 -> 10) is REJECTED', fsSim.canUpdateProduct(unauthenticatedCtx, 'prod_red_roses', stockIncrement) === false);

const negativeStock = { name: 'باقة الورد الأحمر', price: 160, stock: -1, updatedAt: '2026-10-19T01:00:00Z' };
test('3.3 Setting negative stock is REJECTED', fsSim.canUpdateProduct(unauthenticatedCtx, 'prod_red_roses', negativeStock) === false);

// --- SUITE 4: Authenticated Customer Access Tests ---
console.log('\n--- 4. Authenticated Customer Privacy & Role Tests ---');
test('4.1 Customer CAN read their own order (ord_1)', fsSim.canGetOrder(customerCtx, 'ord_1') === true);
test('4.2 Customer CANNOT read another customer order (ord_2) (Blocked)', fsSim.canGetOrder(customerCtx, 'ord_2') === false);
test('4.3 Customer CANNOT list all store orders (Blocked)', fsSim.canListOrders(customerCtx) === false);
test('4.4 Customer CANNOT delete an order (Blocked)', fsSim.canDeleteOrder(customerCtx) === false);
test('4.5 Customer CANNOT elevate their role to admin (Blocked)', fsSim.canUpdateUser(customerCtx, 'cust_123', { role: 'admin' }) === false);

// --- SUITE 5: Super Admin & Staff Access Tests ---
console.log('\n--- 5. Super Admin & Staff Full Authority Tests ---');
test('5.1 Super Admin CAN list all orders (Allowed)', fsSim.canListOrders(superAdminCtx) === true);
test('5.2 Super Admin CAN read any customer order (Allowed)', fsSim.canGetOrder(superAdminCtx, 'ord_2') === true);
test('5.3 Super Admin CAN update order status (Allowed)', fsSim.canUpdateOrder(superAdminCtx) === true);
test('5.4 Super Admin CAN update product price and catalog (Allowed)', fsSim.canUpdateProduct(superAdminCtx, 'prod_red_roses', { name: 'باقة الورد الأحمر', price: 175, stock: 20, updatedAt: 'now' }) === true);
test('5.5 Super Admin CAN update store settings (Allowed)', fsSim.canWriteSettings(superAdminCtx) === true);

// --- SUITE 6: Firebase Storage Protection Tests ---
console.log('\n--- 6. Firebase Storage Access Tests ---');
test('6.1 Public CAN read images (Allowed)', storageSim.canRead() === true);
test('6.2 Unauthenticated user CANNOT upload files (Blocked)', storageSim.canWrite(unauthenticatedCtx, 1024, 'image/jpeg') === false);
test('6.3 Customer CANNOT upload files (Blocked)', storageSim.canWrite(customerCtx, 1024, 'image/jpeg') === false);
test('6.4 Staff CAN upload JPEG under 10MB (Allowed)', storageSim.canWrite(superAdminCtx, 2 * 1024 * 1024, 'image/jpeg') === true);
test('6.5 Staff CANNOT upload non-image files (e.g., .exe / script) (Blocked)', storageSim.canWrite(superAdminCtx, 1024, 'application/x-msdownload') === false);
test('6.6 Staff CANNOT upload files exceeding 10MB limit (Blocked)', storageSim.canWrite(superAdminCtx, 15 * 1024 * 1024, 'image/jpeg') === false);

console.log('\n====================================================');
console.log(`🏁 AUDIT TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');
if (failCount > 0) {
  process.exit(1);
}
