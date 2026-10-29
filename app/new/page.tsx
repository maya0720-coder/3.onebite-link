import NewLinkForm from "@/components/new-link-form";
import { folders } from "@/lib/mock-data";

export default function NewLinkPage() {
  return (
    <section className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">새 링크</h1>
      <NewLinkForm folders={folders} />
    </section>
  );
}
