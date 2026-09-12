"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemTitle?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  itemTitle,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  confirmVariant = "danger",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isPending) return;
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  const isDanger = confirmVariant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={!isPending ? onCancel : undefined}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-[#161616] border border-white/15 rounded-sm p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header with Icon and Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                isDanger
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-bronze/10 border-bronze/30 text-bronze"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-canvas tracking-wide font-normal">
                {title}
              </h3>
              <p className="text-[10px] tracking-widest uppercase text-canvas/40 font-mono">
                STUDIO ACTION CONFIRMATION
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isPending}
            className="text-canvas/40 hover:text-canvas transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          {itemTitle && (
            <div className="p-3 bg-white/5 border border-white/10 rounded font-mono text-xs text-bronze-light break-all">
              <span className="text-[10px] text-canvas/40 block uppercase tracking-widest mb-0.5">
                TARGET RECORD
              </span>
              {itemTitle}
            </div>
          )}
          <p className="text-xs text-canvas/70 leading-relaxed font-sans font-light">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2.5 border border-white/20 text-canvas text-xs tracking-ultra uppercase hover:border-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-medium tracking-ultra uppercase transition-all duration-200 disabled:opacity-50 ${
              isDanger
                ? "bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-950/40"
                : "bg-bronze text-white hover:bg-bronze-light shadow-lg shadow-bronze/30"
            }`}
          >
            {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isPending ? "PROCESSING..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
