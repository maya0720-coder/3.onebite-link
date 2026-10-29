"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  label: string;
  href: string;
};

export default function SidebarItem({ label, href }: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <NextLink
      href={href}
      aria-current={active ? "page" : undefined}
      className={`sidebar-item block w-full rounded-xl px-4 py-2.5 text-left text-[15px] ${
        active
          ? "bg-[var(--accent-soft)] font-bold text-[var(--accent)]"
          : "font-medium text-[var(--text)]"
      }`}
    >
      {label}
    </NextLink>
  );
}
