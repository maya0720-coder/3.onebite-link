import Logo from "@/components/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-8 rounded-2xl bg-[var(--surface)] px-6 py-10 shadow-[var(--shadow-card)]">
        <Logo />
        {children}
      </div>
    </main>
  );
}
