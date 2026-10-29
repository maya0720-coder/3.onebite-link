import type { Link } from "@/types/link";

type LinkCardProps = {
  link: Link;
};

export default function LinkCard({ link }: LinkCardProps) {
  const hostname = new URL(link.url).hostname;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <h3 className="font-semibold text-zinc-900">{link.title}</h3>
      <p className="line-clamp-2 text-sm text-zinc-600">{link.description}</p>
      <span className="mt-auto truncate text-xs text-zinc-400">{hostname}</span>
    </a>
  );
}
