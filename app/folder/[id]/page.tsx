import { Suspense } from "react";
import { notFound } from "next/navigation";
import FolderSkeleton from "@/components/folder-skeleton";
import LinkGrid from "@/components/link-grid";
import { getFolders, getLinks } from "@/lib/mock-data";

export async function generateStaticParams() {
  const folders = await getFolders();
  return folders.map((folder) => ({ id: String(folder.id) }));
}

export default function FolderPage({ params }: PageProps<"/folder/[id]">) {
  // 빌드 이후 추가된 폴더는 요청 시점에 렌더링되므로 Suspense로 감싸 스트리밍한다.
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
      <LinkGrid links={folderLinks} />
    </section>
  );
}
