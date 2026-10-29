import LinkGrid from "@/components/link-grid";
import { links } from "@/lib/mock-data";

export default function Home() {
  return <LinkGrid links={links} />;
}
