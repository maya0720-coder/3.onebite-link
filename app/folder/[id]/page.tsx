import { notFound } from "next/navigation";
import LinkGrid from "@/components/link-grid";
import { folders, links } from "@/lib/mock-data";

export function generateStaticParams() {
  return folders.map((folder) => ({ id: String(folder.id) }));
}

export default async function FolderPage({ params }: PageProps<"/folder/[id]">) {
  const { id } = await params;
  const folder = folders.find((folder) => String(folder.id) === id);

  if (!folder) {
    notFound();
  }

  const folderLinks = links.filter((link) => link.folderId === folder.id);

  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">{folder.name}</h1>
      <LinkGrid links={folderLinks} />
    </section>
  );
}
