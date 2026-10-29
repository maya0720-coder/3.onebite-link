import type { Link } from "@/types/link";

type LinkCardProps = {
  link: Link;
};

export default function LinkCard({ link }: LinkCardProps) {
  const hostname = new URL(link.url).hostname.replace(/^www\./, "");

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover flex h-full flex-col gap-3 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[17px] font-bold text-[var(--accent)]">
          {link.title.charAt(0).toUpperCase()}
        </span>
        <h3 className="truncate text-[17px] font-bold text-[var(--text)]">
          {link.title}
        </h3>
      </div>
      <p className="line-clamp-2 text-[15px] leading-[1.5] text-[var(--text-sub)]">
        {link.description}
      </p>
      <span className="mt-auto self-start truncate rounded-lg bg-[var(--bg)] px-2.5 py-1 text-sm text-[var(--text-sub)]">
        {hostname}
      </span>
    </a>
  );
}
