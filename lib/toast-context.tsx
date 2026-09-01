"use client";

import React, { createContext, useCallback, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

const DEDUP_WINDOW_MS = 500; // Prevent duplicate messages within 500ms

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastToastRef = useRef<{
    message: string;
    type: ToastType;
    time: number;
  } | null>(null);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const now = Date.now();

      // Deduplicate: don't show same message within 500ms
      if (
        lastToastRef.current &&
        lastToastRef.current.message === message &&
        lastToastRef.current.type === type &&
        now - lastToastRef.current.time < DEDUP_WINDOW_MS
      ) {
        return lastToastRef.current.message; // Return existing toast ID
      }

      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, message, type, duration };

      lastToastRef.current = { message, type, time: now };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, duration);
        return id;
      }

      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
