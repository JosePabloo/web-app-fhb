// src/types/global.d.ts
export {};

declare global {
  interface Window {
    recaptchaVerifier?: import('firebase/auth').RecaptchaVerifier;
  }
}