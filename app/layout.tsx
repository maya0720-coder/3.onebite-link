import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "북마크 관리 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
