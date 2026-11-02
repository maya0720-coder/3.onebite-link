import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-5 pt-9 pb-12">
          <div className="mx-auto w-full max-w-[640px]">{children}</div>
        </main>
      </div>
    </>
  );
}
