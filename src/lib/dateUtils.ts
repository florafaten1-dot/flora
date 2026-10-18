/**
 * Utility functions for Makkah Timezone (Asia/Riyadh, UTC+3)
 * Delivery Policy: 2 to 5 days preparation and delivery window.
 */

// Returns a Date object representing the current local time in Makkah
export function getMakkahNow(): Date {
  const now = new Date();
  const makkahString = now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });
  return new Date(makkahString);
}

export interface DeliveryDateOption {
  dateStr: string; // YYYY-MM-DD
  dayName: string; // e.g. "الثلاثاء"
  formattedArabic: string; // e.g. "الثلاثاء، 20 أكتوبر"
  offsetDays: number;
}

export function getMakkahDeliveryRange(): {
  minDateStr: string;
  maxDateStr: string;
  allowedDates: DeliveryDateOption[];
} {
  const now = getMakkahNow();
  const allowedDates: DeliveryDateOption[] = [];

  // Allowed preparation & delivery window: strictly 2 to 5 days
  for (let offset = 2; offset <= 5; offset++) {
    const target = new Date(now);
    target.setDate(now.getDate() + offset);

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dayName = target.toLocaleDateString('ar-SA', { weekday: 'long' });
    const formattedArabic = target.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    allowedDates.push({
      dateStr,
      dayName,
      formattedArabic,
      offsetDays: offset
    });
  }

  return {
    minDateStr: allowedDates[0].dateStr,
    maxDateStr: allowedDates[allowedDates.length - 1].dateStr,
    allowedDates
  };
}

/**
 * Re-validates whether the given date string falls strictly within the 2-5 days window
 * based on Makkah local time.
 */
export function isValidMakkahDeliveryDate(dateStr: string): boolean {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const { allowedDates } = getMakkahDeliveryRange();
  return allowedDates.some(d => d.dateStr === dateStr);
}

/**
 * Saudi phone number validator and normalizer
 * Formats supported: 05xxxxxxxx, 5xxxxxxxx, +9665xxxxxxxx, 9665xxxxxxxx
 */
export function validateAndFormatSaudiPhone(phone: string): { isValid: boolean; formatted: string; error?: string } {
  if (!phone) {
    return { isValid: false, formatted: '', error: 'رقم الجوال مطلوب' };
  }

  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+966')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('00966')) {
    cleaned = '0' + cleaned.slice(5);
  } else if (cleaned.startsWith('966')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('5')) {
    cleaned = '0' + cleaned;
  }

  const saudiRegex = /^05\d{8}$/;
  if (!saudiRegex.test(cleaned)) {
    return {
      isValid: false,
      formatted: cleaned,
      error: 'يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام (مثال: 0512345678)'
    };
  }

  return { isValid: true, formatted: cleaned };
}
