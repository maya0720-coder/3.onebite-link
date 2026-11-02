import type { Metadata } from "next";
import { Suspense } from "react";
import FolderSkeleton from "@/components/folder-skeleton";
import LinkGrid from "@/components/link-grid";
import { getFolders, getLinks } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "전체 링크",
};

export default function Home() {
  // 링크는 로그인한 사용자마다 달라 요청 시점에 불러오므로 Suspense로 감싸 스트리밍한다.
  return (
    <Suspense fallback={<FolderSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [links, folders] = await Promise.all([getLinks(), getFolders()]);

  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">전체 링크</h1>
      <LinkGrid links={links} folders={folders} />
    </section>
  );
}
