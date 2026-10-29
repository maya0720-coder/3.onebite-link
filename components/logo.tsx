import NextLink from "next/link";

export default function Logo() {
  return (
    <NextLink
      href="/"
      className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--text)]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--accent)] text-base text-white">
        한
      </span>
      한입 링크
    </NextLink>
  );
}
