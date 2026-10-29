import Logo from "@/components/logo";
import NewFolderButton from "@/components/new-folder-button";
import NewLinkButton from "@/components/new-link-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-[var(--surface)] px-5 shadow-[var(--shadow-nav)]">
      <Logo />
      <div className="flex items-center gap-2">
        <NewFolderButton />
        <NewLinkButton />
      </div>
    </header>
  );
}
