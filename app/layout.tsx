import type { Metadata } from "next";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { getFolders } from "@/lib/mock-data";
import "./globals.css";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "북마크 관리 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const folders = await getFolders();

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <Header />
        <div className="flex flex-1">
          <Sidebar folders={folders} />
          <main className="flex-1 px-5 pt-9 pb-12">
            <div className="mx-auto w-full max-w-[640px]">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
