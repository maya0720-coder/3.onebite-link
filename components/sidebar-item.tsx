type SidebarItemProps = {
  label: string;
  active?: boolean;
};

export default function SidebarItem({ label, active = false }: SidebarItemProps) {
  return (
    <button
      type="button"
      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-zinc-900 font-medium text-white"
          : "text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
