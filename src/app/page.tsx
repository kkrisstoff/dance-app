import { redirect } from "next/navigation";

// Root redirect — teacher always lands on the scanner
export default function Home() {
  redirect("/scan");
}
