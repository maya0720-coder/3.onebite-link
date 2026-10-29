import LinkCard from "@/components/link-card";
import type { Link } from "@/types/link";

type LinkGridProps = {
  links: Link[];
};

export default function LinkGrid({ links }: LinkGridProps) {
  if (links.length === 0) {
    return <p className="text-sm text-zinc-500">등록된 링크가 없습니다.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} />
        </li>
      ))}
    </ul>
  );
}
