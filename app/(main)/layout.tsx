import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { getFolders } from "@/lib/mock-data";

export default async function MainLayout({ children }: LayoutProps<"/">) {
  const folders = await getFolders();

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar folders={folders} />
        <main className="flex-1 px-5 pt-9 pb-12">
          <div className="mx-auto w-full max-w-[640px]">{children}</div>
        </main>
      </div>
    </>
  );
}
