
import React from "react";

export function ActionButton({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}) {
  const base =
    "w-full sm:w-auto min-w-[160px] px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-primary text-[var(--on-primary)]"
      : "bg-surface border border-theme text-main";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${styles}`}
    >
      {loading ? "Working…" : children}
    </button>
  );
}
