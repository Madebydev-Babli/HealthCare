"use client";

import React from "react";

export function Input({ label, className = "", ...props }: any) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}

      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:border-primary focus:ring-0 ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
