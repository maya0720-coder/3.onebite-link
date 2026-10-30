import DeleteLinkButton from "@/components/delete-link-button";
import EditLinkButton from "@/components/edit-link-button";
import LinkCard from "@/components/link-card";
import type { Folder, Link } from "@/types/link";

type LinkGridProps = {
  links: Link[];
  folders: Folder[];
};

export default function LinkGrid({ links, folders }: LinkGridProps) {
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
        <li key={link.id} className="link-item relative">
          <LinkCard link={link} />
          {/* <a> 안에는 버튼을 넣을 수 없으므로 카드 위에 겹쳐 배치한다. */}
          <div className="link-actions absolute top-3 right-3 flex gap-1.5">
            <EditLinkButton link={link} folders={folders} />
            <DeleteLinkButton link={link} />
          </div>
        </li>
      ))}
    </ul>
  );
}
