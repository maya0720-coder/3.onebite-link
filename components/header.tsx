import Logo from "@/components/logo";
import NewLinkButton from "@/components/new-link-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-[var(--surface)] px-5 shadow-[var(--shadow-nav)]">
      <Logo />
      <NewLinkButton />
    </header>
  );
}
