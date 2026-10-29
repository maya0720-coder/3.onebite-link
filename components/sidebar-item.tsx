"use client";

import { Suspense } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  label: string;
  href: string;
};

// usePathname은 요청 시점에만 알 수 있으므로, 프리렌더 단계에서는 비활성 상태로 먼저 보여준다.
export default function SidebarItem(props: SidebarItemProps) {
  return (
    <Suspense fallback={<SidebarLink {...props} active={false} />}>
      <ActiveSidebarLink {...props} />
    </Suspense>
  );
}

function ActiveSidebarLink(props: SidebarItemProps) {
  const pathname = usePathname();
  return <SidebarLink {...props} active={pathname === props.href} />;
}

function SidebarLink({ label, href, active }: SidebarItemProps & { active: boolean }) {
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
