// Configuration constants for Look & Glow by Fer store
export const STORE_PHONE_NUMBER = '59163434038';
export const STORE_PHONE_DISPLAY = '+591 63434038';

/**
 * Generates an official WhatsApp click-to-chat URL for Look & Glow by Fer
 * @param message The pre-filled message text
 */
export const getWhatsAppUrl = (message: string): string => {
  return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};
