import type { Metadata } from "next";
import { Suspense } from "react";
import NewLinkForm from "@/components/new-link-form";
import { getFolders } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "새 링크",
};

export default function NewLinkPage() {
  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">새 링크</h1>
      {/* 폴더 목록은 로그인한 사용자마다 달라 요청 시점에 불러온다. */}
      <Suspense fallback={<div className="h-[200px] animate-pulse rounded-2xl bg-[var(--surface)]" />}>
        <NewLinkFormWithFolders />
      </Suspense>
    </section>
  );
}

async function NewLinkFormWithFolders() {
  const folders = await getFolders();
  return <NewLinkForm folders={folders} />;
}
