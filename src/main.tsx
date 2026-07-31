import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global Date Locale Patch
const getSpeechLangCode = (lang: string = "English"): string => {
  const l = lang.toLowerCase();
  if (l.includes("kannada")) return "kn-IN";
  if (l.includes("hindi")) return "hi-IN";
  if (l.includes("tamil")) return "ta-IN";
  if (l.includes("telugu")) return "te-IN";
  if (l.includes("malayalam")) return "ml-IN";
  if (l.includes("marathi")) return "mr-IN";
  if (l.includes("bengali")) return "bn-IN";
  if (l.includes("gujarati")) return "gu-IN";
  if (l.includes("spanish")) return "es-ES";
  if (l.includes("french")) return "fr-FR";
  return "en-US";
};

const originalToLocaleString = Date.prototype.toLocaleString;
const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
const originalToLocaleDateString = Date.prototype.toLocaleDateString;
const originalNumberToLocaleString = Number.prototype.toLocaleString;

function getCurrentLocale() {
  const lang = localStorage.getItem('preferred_language') || 'English';
  return getSpeechLangCode(lang);
}

Date.prototype.toLocaleString = function(this: Date, locales?: any, options?: any): string {
  return originalToLocaleString.call(this, locales || getCurrentLocale(), options);
} as any;
Date.prototype.toLocaleTimeString = function(this: Date, locales?: any, options?: any): string {
  return originalToLocaleTimeString.call(this, locales || getCurrentLocale(), options);
} as any;
Date.prototype.toLocaleDateString = function(this: Date, locales?: any, options?: any): string {
  return originalToLocaleDateString.call(this, locales || getCurrentLocale(), options);
} as any;
Number.prototype.toLocaleString = function(this: Number, locales?: any, options?: any): string {
  return originalNumberToLocaleString.call(this, locales || getCurrentLocale(), options);
} as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
