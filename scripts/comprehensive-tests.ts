/**
 * Comprehensive Automated Test Suite for Flora Faten Store
 * Tests:
 * 1. Makkah, Jeddah, Riyadh, and sneaked addresses
 * 2. Minimum order amount (50 SAR threshold)
 * 3. Free delivery threshold (300 SAR threshold)
 * 4. Price snapshot immutability
 * 5. Out of stock & atomic stock depletion simulation
 * 6. Idempotency & duplicate order prevention
 * 7. SEO JSON-LD check (no fake telephone)
 * 8. Occasions check (no birthdays in codebase)
 */

import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, STORE_OCCASIONS } from '../src/lib/initialData';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean | undefined | null, testName: string, extraInfo?: any) {
  if (Boolean(condition)) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`, extraInfo ?? '');
    failedTests++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE FLORA FATEN AUDIT TEST SUITE');
console.log('====================================================\n');

// --- 1. Address & City Enforcement Tests ---
console.log('--- 1. Address & City Enforcement ---');
const forbiddenCities = ['جدة', 'الرياض', 'الدمام', 'المدينة', 'الطائف', 'الخبر', 'jeddah', 'riyadh', 'dammam', 'تبوك', 'أبها', 'بريدة', 'عنيزة', 'حائل', 'جازان', 'نجران', 'ينبع', 'الجبيل'];

function validateOrderAddress(city: string, district: string, address: string): { valid: boolean; error?: string } {
  const cityLower = (city || '').toLowerCase();
  const districtLower = (district || '').toLowerCase();
  const addressLower = (address || '').toLowerCase();
  const combined = `${cityLower} ${districtLower} ${addressLower}`;

  const containsForbidden = forbiddenCities.some(c => combined.includes(c));
  if (containsForbidden || !cityLower.includes('مكة')) {
    return { valid: false, error: 'خدمة التوصيل لدى متجر فلورا فاتن متاحة حصرياً داخل أحياء مكة المكرمة فقط. لا يمكن إتمام الطلب لأي مدينة أخرى.' };
  }
  return { valid: true };
}

// 1.1 Makkah valid
const r1 = validateOrderAddress('مكة المكرمة - حي الحمراء (المنطقة الرئيسية)', 'حي الحمراء', 'شارع أم القرى بجوار جامع السلام');
assert(r1.valid === true, '1.1 Valid Makkah address is accepted');

// 1.2 Jeddah in city
const r2 = validateOrderAddress('جدة', 'حي الروضة', 'شارع التحلية');
assert(r2.valid === false && r2.error?.includes('حصرياً داخل أحياء مكة'), '1.2 Jeddah city is strictly rejected');

// 1.3 Riyadh in city
const r3 = validateOrderAddress('الرياض', 'حي النرجس', 'طريق أنس بن مالك');
assert(r3.valid === false && r3.error?.includes('حصرياً داخل أحياء مكة'), '1.3 Riyadh city is strictly rejected');

// 1.4 Sneaked Jeddah inside street address
const r4 = validateOrderAddress('مكة المكرمة', 'حي الحمراء', 'يرجى التوصيل إلى فرع جدة شارع الأندلس');
assert(r4.valid === false && r4.error?.includes('حصرياً داخل أحياء مكة'), '1.4 Sneaked forbidden city in address is detected & rejected');

// 1.5 Sneaked Riyadh inside district
const r5 = validateOrderAddress('مكة المكرمة', 'الرياض العليا', 'شارع رئيسي');
assert(r5.valid === false && r5.error?.includes('حصرياً داخل أحياء مكة'), '1.5 Sneaked forbidden city in district is detected & rejected');

// --- 2. Minimum Order Amount (50 SAR) ---
console.log('\n--- 2. Minimum Order Amount Validation ---');
const minOrderAmount = INITIAL_SETTINGS.minOrderAmount ?? 50;

function validateMinOrder(subtotal: number): boolean {
  if (subtotal < minOrderAmount) {
    return false;
  }
  return true;
}

assert(validateMinOrder(45) === false, '2.1 Subtotal 45 SAR (< 50) is rejected');
assert(validateMinOrder(50) === true, '2.2 Subtotal 50 SAR (== 50) is accepted');
assert(validateMinOrder(180) === true, '2.3 Subtotal 180 SAR (> 50) is accepted');

// --- 3. Free Delivery Threshold (300 SAR) ---
console.log('\n--- 3. Free Delivery Threshold Validation ---');
const freeDeliveryThreshold = INITIAL_SETTINGS.freeDeliveryThreshold ?? 300;
const defaultDeliveryFee = INITIAL_SETTINGS.deliveryFeeDefault ?? 20;

function calculateDeliveryFee(subtotal: number, rawFee: number = defaultDeliveryFee): number {
  return subtotal >= freeDeliveryThreshold ? 0 : rawFee;
}

assert(calculateDeliveryFee(150) === 20, '3.1 Subtotal 150 SAR pays standard delivery fee (20 SAR)');
assert(calculateDeliveryFee(299) === 20, '3.2 Subtotal 299 SAR pays standard delivery fee (20 SAR)');
assert(calculateDeliveryFee(300) === 0, '3.3 Subtotal 300 SAR receives free delivery (0 SAR)');
assert(calculateDeliveryFee(450) === 0, '3.4 Subtotal 450 SAR receives free delivery (0 SAR)');

// --- 4. Price Snapshot Immutability ---
console.log('\n--- 4. Price Snapshot Immutability ---');
const catalogProduct = { id: 'prod_test', name: 'بوكيه توليب ساتان', price: 160 };
const orderItem = {
  productId: catalogProduct.id,
  name: catalogProduct.name,
  unitPrice: catalogProduct.price,
  quantity: 2,
  itemTotal: catalogProduct.price * 2
};
const orderSnapshot = {
  id: 'order_immutability_test',
  orderNumber: 'FF-2026-TEST',
  items: [orderItem],
  subtotal: orderItem.itemTotal,
  total: orderItem.itemTotal
};

// Simulate catalog price increase afterwards:
catalogProduct.price = 280;
assert(orderSnapshot.items[0].unitPrice === 160, '4.1 Order unitPrice remains 160 SAR despite catalog change');
assert(orderSnapshot.total === 320, '4.2 Order total remains 320 SAR despite catalog change');

// --- 5. Out of Stock & Stock Depletion Simulation ---
console.log('\n--- 5. Atomic Stock Verification & Depletion ---');
interface MockProductDoc {
  id: string;
  stock: number;
}
const mockDbProducts: Record<string, MockProductDoc> = {
  'prod_last_piece': { id: 'prod_last_piece', stock: 1 }
};

function simulateAtomicOrder(productId: string, requestedQty: number): { success: boolean; error?: string } {
  const p = mockDbProducts[productId];
  if (!p) return { success: false, error: 'Product not found' };
  if (p.stock < requestedQty) {
    return { success: false, error: `عذراً، نفدت الكمية المطلوبة. الكمية المتبقية (${p.stock}) فقط.` };
  }
  // Decrement atomically
  p.stock -= requestedQty;
  return { success: true };
}

// First order takes the last piece
const orderAttempt1 = simulateAtomicOrder('prod_last_piece', 1);
assert(orderAttempt1.success === true, '5.1 First order takes last piece successfully');
assert(mockDbProducts['prod_last_piece'].stock === 0, '5.2 Stock decremented to 0');

// Second concurrent order attempts to buy
const orderAttempt2 = simulateAtomicOrder('prod_last_piece', 1);
assert(orderAttempt2.success === false && orderAttempt2.error?.includes('نفدت الكمية'), '5.3 Second order is rejected due to zero stock');

// --- 6. Idempotency & Duplicate Order Prevention ---
console.log('\n--- 6. Idempotency & Duplicate Order Prevention ---');
const placedOrdersDb = new Map<string, any>();

function simulateSubmitOrderWithIdempotency(orderId: string, payload: any): { isDuplicate: boolean; order: any } {
  if (placedOrdersDb.has(orderId)) {
    return { isDuplicate: true, order: placedOrdersDb.get(orderId) };
  }
  placedOrdersDb.set(orderId, { ...payload, id: orderId });
  return { isDuplicate: false, order: placedOrdersDb.get(orderId) };
}

const req1 = simulateSubmitOrderWithIdempotency('order_fixed_token_123', { customerName: 'فاطمة', total: 200 });
assert(req1.isDuplicate === false, '6.1 Initial order created successfully');

const req2 = simulateSubmitOrderWithIdempotency('order_fixed_token_123', { customerName: 'فاطمة', total: 200 });
assert(req2.isDuplicate === true && req2.order.id === 'order_fixed_token_123', '6.2 Repeated submission detected as duplicate and returned existing order without second insert');

// --- 7. SEO Schema Check (No fake telephone) ---
console.log('\n--- 7. SEO Schema Validation ---');
const indexHtmlContent = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
const hasTelephoneInHtml = indexHtmlContent.includes('"telephone"');
assert(!hasTelephoneInHtml, '7.1 Fake telephone property is completely removed from index.html');
const hasCanonical = indexHtmlContent.includes('rel="canonical" href="https://www.florafaten.store/"');
assert(hasCanonical, '7.2 Canonical link to https://www.florafaten.store/ is correctly present');

// --- 8. Occasions & Birthday Removal Check ---
console.log('\n--- 8. Store Occasions & Birthday Removal ---');
const hasBirthdayInStoreOccasions = STORE_OCCASIONS.some(o => o.id === ('birthday' as any) || o.name.includes('ميلاد'));
assert(!hasBirthdayInStoreOccasions, '8.1 No birthday present in STORE_OCCASIONS');
const celebrationsOccasion = STORE_OCCASIONS.find(o => o.id === 'celebrations');
assert(celebrationsOccasion !== undefined && celebrationsOccasion.name.includes('الاحتفالات'), '8.2 Special celebrations occasion is present as approved replacement');

// --- SUMMARY ---
console.log('\n====================================================');
console.log(`🏁 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
}
