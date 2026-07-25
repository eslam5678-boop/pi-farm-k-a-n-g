export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SDK_LITE_URL: "https://pi-apps.github.io/pi-sdk-lite/build/production/sdklite.js",
  SANDBOX: true, // Changed to true for testing - removes SSL/certificate validation
  
  // IMPORTANT: App ID Configuration
  // 1. Get your App ID from: https://developers.pi.computer/
  // 2. Replace "pharaohs-pi-farm" below with your actual App ID
  // 3. Or set environment variable: NEXT_PUBLIC_PI_APP_ID=your-app-id
  // 4. Or set window.__PI_APP_ID before app loads
  APP_ID: typeof window !== "undefined" 
    ? (window as any).__PI_APP_ID || process.env.NEXT_PUBLIC_PI_APP_ID || "pharaohs-pi-farm"
    : process.env.NEXT_PUBLIC_PI_APP_ID || "pharaohs-pi-farm",
  
  // IMPORTANT: Callback URL Configuration
  // This must match EXACTLY what you registered in Pi Developer Portal
  // Including protocol (https for production, http for localhost)
  CALLBACK_URL: typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_CALLBACK_URL || "http://localhost:3000",
  
  ENABLE_MOCK_MODE: true, // Enable mock mode fallback if Pi SDK fails
} as const;
