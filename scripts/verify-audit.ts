// Unit verification test script for Flora Faten audit assertions
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, STORE_OCCASIONS } from '../src/lib/initialData';

console.log('=== TEST 1: Delivery Address & City Enforcement ===');
const forbiddenCities = ['جدة', 'الرياض', 'الدمام', 'المدينة', 'الطائف', 'الخبر', 'jeddah', 'riyadh', 'dammam'];

function validateAddress(city: string, district: string, address: string): { valid: boolean; reason?: string } {
  const cityLower = (city || '').toLowerCase();
  const districtLower = (district || '').toLowerCase();
  const addressLower = (address || '').toLowerCase();
  const combined = `${cityLower} ${districtLower} ${addressLower}`;

  const hasForbidden = forbiddenCities.some(c => combined.includes(c));
  if (hasForbidden || !cityLower.includes('مكة')) {
    return { valid: false, reason: 'خدمة التوصيل متاحة حصرياً داخل أحياء مكة المكرمة فقط.' };
  }
  return { valid: true };
}

// Case 1: Makkah address
const test1 = validateAddress('مكة المكرمة - حي الحمراء', 'حي الحمراء', 'شارع أم القرى بجوار المسجد');
console.log('Case 1 (Makkah valid):', test1);

// Case 2: Jeddah address in city
const test2 = validateAddress('جدة', 'حي الروضة', 'شارع التحلية');
console.log('Case 2 (Jeddah in city):', test2);

// Case 3: Riyadh address in city
const test3 = validateAddress('الرياض', 'حي العليا', 'طريق الملك فهد');
console.log('Case 3 (Riyadh in city):', test3);

// Case 4: City is Makkah, but district/address mentions Jeddah
const test4 = validateAddress('مكة المكرمة', 'حي الروضة', 'توصيل إلى جدة طريق الحرمين');
console.log('Case 4 (Sneaked Jeddah):', test4);

console.log('\n=== TEST 2: Price Snapshot Immutability Simulation ===');
const mockProduct = { ...INITIAL_PRODUCTS[0], price: 180, salePrice: undefined };
const orderItem = {
  productId: mockProduct.id,
  name: mockProduct.name,
  image: mockProduct.image,
  unitPrice: mockProduct.price,
  quantity: 2,
  itemTotal: mockProduct.price * 2
};
const orderSnapshot = {
  orderNumber: 'FF-2026-TEST',
  items: [orderItem],
  subtotal: orderItem.itemTotal,
  total: orderItem.itemTotal
};
console.log('Order created with unitPrice:', orderSnapshot.items[0].unitPrice, 'total:', orderSnapshot.total);

// Modify catalog product price later
mockProduct.price = 300;
console.log('Product price changed in catalog to:', mockProduct.price);
console.log('Order snapshot price remains:', orderSnapshot.items[0].unitPrice, 'total:', orderSnapshot.total);
console.log('Price immutability holds in memory?', orderSnapshot.items[0].unitPrice === 180);

console.log('\n=== TEST 3: Occasions & Birthday Check ===');
console.log('STORE_OCCASIONS count:', STORE_OCCASIONS.length);
console.log('Any birthday in STORE_OCCASIONS?', STORE_OCCASIONS.some(o => o.id === ('birthday' as any) || o.name.includes('ميلاد')));

console.log('\n=== TEST 4: Free Delivery Threshold & Min Order Amount ===');
console.log('initialData minOrderAmount:', INITIAL_SETTINGS.minOrderAmount);
console.log('initialData freeDeliveryThreshold:', INITIAL_SETTINGS.freeDeliveryThreshold);
