"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type { Product, SDKLiteInstance, UserPurchaseBalance } from "@/lib/sdklite-types";
import { AuthLoadingScreen } from "./auth-loading-screen";

const ENABLE_DEV_MODE = true;
const COMMUNICATION_REQUEST_TYPE = '@pi:app:sdk:communication_information_request';

function isInIframe(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return window.self !== window.top;
  } catch (error) {
    return true;
  }
}

function parseJsonSafely(value: any): any {
  try {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return typeof value === 'object' && value !== null ? value : null;
  } catch (error) {
    return null;
  }
}

function requestParentCredentials(): Promise<{ accessToken: string; appId: string | null } | null> {
  try {
    if (!isInIframe()) return Promise.resolve(null);
    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => resolve(null), 1500);
      const listener = (event: MessageEvent) => {
        try {
          if (event.source !== window.parent) return;
          const data = parseJsonSafely(event.data);
          if (!data || data.type !== COMMUNICATION_REQUEST_TYPE || data.id !== requestId) return;
          window.removeEventListener('message', listener);
          clearTimeout(timeoutId);
          const payload = data.payload || {};
          resolve(payload.accessToken ? { accessToken: payload.accessToken, appId: payload.appId } : null);
        } catch (e) {
          resolve(null);
        }
      };
      window.addEventListener('message', listener);
      window.parent.postMessage(JSON.stringify({ type: COMMUNICATION_REQUEST_TYPE, id: requestId }), '*');
    });
  } catch (e) {
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

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<UserPurchaseBalance[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; id: string } | null>(null);

  const initialize = async () => {
    setIsLoading(true);
    if (ENABLE_DEV_MODE) {
      setIsAuthenticated(true);
      setAuthMessage("Development mode - authenticated");
      setUser({ username: "مطور", id: "dev-user-12345" });
      setIsLoading(false);
      return;
    }
    
    try {
      setIsAuthenticated(true);
      setUser({ username: "مستخدم Pi", id: "pi-user-123" });
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <PiAuthContext.Provider
      value={{
        isAuthenticated,
        authMessage,
        hasError,
        sdk,
        products,
        restoredPurchases,
        reinitialize: initialize,
        isLoading,
        user: user || { username: "ضيف", id: "guest" },
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
}

function AppContent({ children }: { children: ReactNode }) {
  const { isLoading } = usePiAuth();
  if (isLoading) {
    return <AuthLoadingScreen />;
  }
  return <>{children}</>;
}

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (ENABLE_DEV_MODE) {
      (window as any).__DEV_MODE__ = true;
    }
  }, []);

  if (!isMounted) return null;

  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  );
}
