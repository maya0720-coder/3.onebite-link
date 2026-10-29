import Logo from "@/components/logo";
import NewLinkButton from "@/components/new-link-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <Logo />
      <NewLinkButton />
    </header>
  );
}
