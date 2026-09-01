"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/ToastContainer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SessionProvider>
        {children}
        <ToastContainer />
      </SessionProvider>
    </ToastProvider>
  );
}
