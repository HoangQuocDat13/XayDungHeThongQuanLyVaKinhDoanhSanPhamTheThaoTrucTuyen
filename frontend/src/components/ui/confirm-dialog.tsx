"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Hủy bỏ",
  variant = "danger",
  loading = false,
  icon,
}: ConfirmDialogProps) {
  const defaultIcon =
    variant === "danger" ? (
      <div className="w-12 h-12 rounded-2xl bg-danger-light flex items-center justify-center">
        <Trash2 size={22} className="text-danger" aria-hidden="true" />
      </div>
    ) : (
      <div className="w-12 h-12 rounded-2xl bg-warning-light flex items-center justify-center">
        <AlertTriangle size={22} className="text-warning" aria-hidden="true" />
      </div>
    );

  const defaultConfirmLabel =
    confirmLabel ?? (variant === "danger" ? "Xác nhận xóa" : "Xác nhận");

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      hideCloseButton
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {defaultConfirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        {icon ?? defaultIcon}
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
