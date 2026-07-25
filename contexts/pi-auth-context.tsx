"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

const COMMUNICATION_REQUEST_TYPE = '@pi:app:sdk:communication_information_request';

function isInIframe(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return window.self !== window.top;
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'SecurityError' || error.code === DOMException.SECURITY_ERR || error.code === 18)
    ) {
      return true;
    }
    if (error instanceof Error && /Permission denied/i.test(error.message)) {
      return true;
    }

    console.error("[v0] Error checking iframe status:", error);
    return false;
  }
}

function parseJsonSafely(value: any): any {
  try {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (parseError) {
        console.error("[v0] Error parsing JSON:", parseError);
        return null;
      }
    }
    return typeof value === 'object' && value !== null ? value : null;
  } catch (error) {
    console.error("[v0] Error in parseJsonSafely:", error);
    return null;
  }
}

function requestParentCredentials(): Promise<{ accessToken: string; appId: string | null } | null> {
  try {
    if (!isInIframe()) {
      return Promise.resolve(null);
    }

    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const timeoutMs = 1500;

    return new Promise((resolve) => {
      try {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const cleanup = (listener: (event: MessageEvent) => void) => {
          try {
            window.removeEventListener('message', listener);
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
            }
          } catch (cleanupError) {
            console.error("[v0] Error in cleanup:", cleanupError);
          }
        };

        const messageListener = (event: MessageEvent) => {
          try {
            if (event.source !== window.parent) {
              return;
            }

            const data = parseJsonSafely(event.data);
            if (!data || data.type !== COMMUNICATION_REQUEST_TYPE || data.id !== requestId) {
              return;
            }

            cleanup(messageListener);

            const payload = typeof data.payload === 'object' && data.payload !== null ? data.payload : {};
            const accessToken = typeof payload.accessToken === 'string' ? payload.accessToken : null;
            const appId = typeof payload.appId === 'string' ? payload.appId : null;

            resolve(accessToken ? { accessToken, appId } : null);
          } catch (listenerError) {
            console.error("[v0] Error in messageListener:", listenerError);
            cleanup(messageListener);
            resolve(null);
          }
        };

        timeoutId = setTimeout(() => {
          try {
            cleanup(messageListener);
            resolve(null);
          } catch (timeoutError) {
            console.error("[v0] Error in timeout handler:", timeoutError);
            resolve(null);
          }
        }, timeoutMs);

        window.addEventListener('message', messageListener);

        window.parent.postMessage(
          JSON.stringify({
            type: COMMUNICATION_REQUEST_TYPE,
            id: requestId
          }),
          '*'
        );
      } catch (err) {
        console.error("[v0] Error in promise setup:", err);
        resolve(null);
      }
    });
  } catch (e) {
    console.error("[v0] Error in requestParentCredentials:", e);
    return Promise.resolve(null);
  }
}

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  reinitialize: () => Promise<void>;
  isLoading: boolean;
  user: { username: string; id: string } | null;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (typeof window.Pi !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

const loadSDKLite = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (typeof window.SDKLite !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_LITE_URL) {
      reject(new Error("SDKLite URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => {
      console.log("SDKLite script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load SDKLite script");
      reject(new Error("Failed to load SDKLite script"));
    };

    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ username: string; id: string } | null>(null);

  const isDevelopmentMode = typeof window !== 'undefined' && (window as any).__DEV_MODE__ === true;

  const fetchProducts = async (sdkInstance: SDKLiteInstance): Promise<void> => {
    try {
      const { products } = await sdkInstance.state.products();
      setProducts(products);
    } catch (e) {
      console.error("Failed to load products:", e);
      setProducts([]);
    }
  };

  const initialize = async () => {
    console.log("[PiAuth] Initialize called");
    setHasError(false);
    setRestoredPurchases(null);
    
    if (isDevelopmentMode) {
      console.log("[PiAuth] Development mode detected - setting dev user");
      setIsAuthenticated(true);
      setAuthMessage("Development mode - authenticated");
      setUser({
        username: "مطور",
        id: "dev-user-12345"
      });
      return;
    }
    
    try {
      console.log("[PiAuth] Probing for parent credentials");
      const parentCredentials = await requestParentCredentials();
      if (parentCredentials) {
        console.log("[PiAuth] Parent credentials found");
        setIsAuthenticated(true);
        setUser({
          username: "مستخدم App Studio",
          id: parentCredentials.appId || "app-studio-user"
        });
        return;
      }

      console.log("[PiAuth] No parent credentials, attempting Pi SDK");
      setAuthMessage("Loading Pi SDK...");
      await loadPiSDK();
      setAuthMessage("Initializing Pi Network...");
      
      await window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
        appId: PI_NETWORK_CONFIG.APP_ID,
      });

      setAuthMessage("Loading SDKLite...");
      await loadSDKLite();

      setAuthMessage("Initializing SDKLite...");
      const sdkInstance = await window.SDKLite.init();
      
      setAuthMessage("Authenticating with Pi Network...");
      const success = await sdkInstance.login();
      
      if (!success) {
        throw new Error("Pi Network login failed");
      }

      setSdk(sdkInstance);
      setIsAuthenticated(true);
      
      try {
        if (window.Pi && typeof window.Pi.user?.getMe === 'function') {
          const userInfo = await (window.Pi.user as any).getMe();
          if (userInfo && userInfo.username) {
            setUser({
              username: userInfo.username,
              id: userInfo.uid || "pi-user-" + Math.random().toString(36).slice(2, 9)
            });
          }
        }
      } catch (userInfoError) {
        setUser({
          username: "مستخدم Pi",
          id: "pi-user-" + Math.random().toString(36).slice(2, 9)
        });
      }
      
      await fetchProducts(sdkInstance);

      try {
        const { purchases } = await sdkInstance.state.restore();
        setRestoredPurchases(purchases);
      } catch (e) {
        setRestoredPurchases([]);
      }
    } catch (err) {
      if (PI_NETWORK_CONFIG.ENABLE_MOCK_MODE) {
        setIsAuthenticated(true);
        setAuthMessage("Running in Mock Mode (Demo)");
        setUser({
          username: "Demo User",
          id: "mock-user-demo",
        });
        return;
      }

      setHasError(true);
      setAuthMessage(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again."
      );
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    hasError,
    sdk,
    products,
    restoredPurchases,
    reinitialize: initialize,
    isLoading,
    user: user || {
      username: "مرحبا بك",
      id: "guest-" + Math.random().toString(36).slice(2, 9)
    },
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
