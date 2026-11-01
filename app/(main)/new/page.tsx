import NewLinkForm from "@/components/new-link-form";
import { getFolders } from "@/lib/mock-data";

export default async function NewLinkPage() {
  const folders = await getFolders();

  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">새 링크</h1>
      <NewLinkForm folders={folders} />
    </section>
  );
}
