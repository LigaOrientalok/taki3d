import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WHATSAPP_NUMBER = "59893123456";
export const CONTACT_EMAIL = "taki3d.uy@gmail.com";
export const INSTAGRAM_USER = "taki.3d.uy";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USER}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola TAKI3D! Quiero un presupuesto para una impresión 3D."
)}`;

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
