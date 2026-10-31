"use client";

import { useFormStatus } from "react-dom";

type SaveButtonProps = {
  label?: string;
  pendingLabel?: string;
  variant?: "primary" | "danger";
  disabled?: boolean;
};

const variantClass = {
  primary: "btn-primary bg-[var(--accent)]",
  danger: "btn-danger bg-[var(--error)]",
};

export default function SaveButton({
  label = "저장",
  pendingLabel = "저장 중...",
  variant = "primary",
  disabled = false,
}: SaveButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${variantClass[variant]} w-full cursor-pointer rounded-xl px-5 py-3.5 text-[17px] font-bold text-white`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
