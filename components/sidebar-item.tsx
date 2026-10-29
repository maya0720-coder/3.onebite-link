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
      className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-zinc-900 font-medium text-white"
          : "text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {label}
    </NextLink>
  );
}
