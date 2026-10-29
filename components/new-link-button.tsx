import NextLink from "next/link";

export default function NewLinkButton() {
  return (
    <NextLink
      href="/new"
      className="btn-primary rounded-xl bg-[var(--accent)] px-4 py-2 text-[15px] font-bold text-white"
    >
      + 새 링크
    </NextLink>
  );
}
