"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

// 화면 상단 가운데에 잠깐 떴다가 사라지는 오류 메시지
export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="alert"
      className="toast fixed top-6 left-1/2 z-50 w-max max-w-[calc(100%-40px)] -translate-x-1/2 rounded-xl bg-[var(--text)] px-5 py-3.5 text-[15px] font-medium text-white shadow-[var(--shadow-card-hover)]"
    >
      {message}
    </div>
  );
}

// 토스트 요소와 띄우는 함수를 함께 돌려준다. 같은 메시지를 연달아 띄워도 매번 새로 나타난다.
export function useToast(initialMessage?: string): [ReactNode, (message: string) => void] {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(() =>
    initialMessage ? { id: 0, message: initialMessage } : null,
  );
  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);
  const closeToast = useCallback(() => setToast(null), []);

  const node = toast ? <Toast key={toast.id} message={toast.message} onClose={closeToast} /> : null;
  return [node, showToast];
}
