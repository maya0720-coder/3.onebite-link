import NewLinkForm from "@/components/new-link-form";
import { folders } from "@/lib/mock-data";

export default function NewLinkPage() {
  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">새 링크</h1>
      <NewLinkForm folders={folders} />
    </section>
  );
}
