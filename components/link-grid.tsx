import LinkCard from "@/components/link-card";
import type { Link } from "@/types/link";

type LinkGridProps = {
  links: Link[];
};

export default function LinkGrid({ links }: LinkGridProps) {
  if (links.length === 0) {
    return (
      <p className="rounded-2xl bg-[var(--surface)] px-5 py-12 text-center text-[17px] text-[var(--text-sub)] shadow-[var(--shadow-card)]">
        등록된 링크가 없습니다.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} />
        </li>
      ))}
    </ul>
  );
}
