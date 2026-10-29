import LinkGrid from "@/components/link-grid";
import { links } from "@/lib/mock-data";

export default function Home() {
  return (
    <section>
      <h1 className="mb-6 text-[26px] leading-[1.3] font-bold">전체 링크</h1>
      <LinkGrid links={links} />
    </section>
  );
}
