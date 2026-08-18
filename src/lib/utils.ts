import { VendorCategory } from './types';

// Currency conversion rates (you might want to fetch these from an API in production)
const EXCHANGE_RATES = {
  USD_TO_NGN: 1650, // 1 USD = 1650 NGN (approximate)
  NGN_TO_USD: 1 / 1650,
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  const currencySymbols = {
    USD: '$',
    NGN: '₦',
  };

  if (isNaN(amount) || amount === null || amount === undefined) {
    return currencySymbols[currency as keyof typeof currencySymbols] + '0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'NGN' ? 'NGN' : 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'NGN' ? 0 : 0,
  }).format(amount).replace(/[A-Z]{3}/, currencySymbols[currency as keyof typeof currencySymbols] || '$');
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 0;
  }
  
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'NGN') {
    return Math.round(amount * EXCHANGE_RATES.USD_TO_NGN);
  }
  
  if (fromCurrency === 'NGN' && toCurrency === 'USD') {
    return Math.round(amount * EXCHANGE_RATES.NGN_TO_USD);
  }
  
  return amount;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getCategoryLabel = (category: VendorCategory): string => {
  const labels: Record<VendorCategory, string> = {
    catering: 'Catering',
    photography: 'Photography',
    venues: 'Venues',
    music: 'Music & Entertainment',
    flowers: 'Flowers & Decor',
    decor: 'Decorations',
    transportation: 'Transportation',
    planning: 'Event Planning',
  };
  return labels[category] || category;
};

export const getCategoryIcon = (category: VendorCategory): string => {
  const icons: Record<VendorCategory, string> = {
    catering: '🍽️',
    photography: '📸',
    venues: '🏛️',
    music: '🎵',
    flowers: '🌸',
    decor: '🎨',
    transportation: '🚗',
    planning: '📋',
  };
  return icons[category] || '📋';
};

export const generateStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return phone; // Return original if not a standard US number
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};