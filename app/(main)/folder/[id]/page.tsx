import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import FolderSkeleton from "@/components/folder-skeleton";
import LinkGrid from "@/components/link-grid";
import { getFolders, getLinks } from "@/lib/mock-data";

// 탭 제목에 폴더 이름을 보여준다. 남의 폴더이거나 없는 폴더면 기본 제목을 쓴다.
export async function generateMetadata({ params }: PageProps<"/folder/[id]">): Promise<Metadata> {
  const { id } = await params;
  const folders = await getFolders();
  const folder = folders.find((folder) => String(folder.id) === id);
  return { title: folder?.name ?? "폴더" };
}

export default function FolderPage({ params }: PageProps<"/folder/[id]">) {
  // 폴더는 로그인한 사용자마다 달라 빌드 때 미리 만들 수 없다.
  // 요청 시점에 렌더링하므로 Suspense로 감싸 스트리밍한다.
  return (
    <Suspense fallback={<FolderSkeleton />}>
      <FolderContent params={params} />
    </Suspense>
  );
}

async function FolderContent({ params }: Pick<PageProps<"/folder/[id]">, "params">) {
  const { id } = await params;
  const folders = await getFolders();
  const folder = folders.find((folder) => String(folder.id) === id);

  if (!folder) {
    notFound();
  }

  const links = await getLinks();
  const folderLinks = links.filter((link) => link.folderId === folder.id);

  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">{folder.name}</h1>
      <LinkGrid links={folderLinks} folders={folders} />
    </section>
  );
}
