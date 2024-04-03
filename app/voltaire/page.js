"use client";
import { MainChat } from "@/components/ui/MainChat";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/");
  const pageName = pathSegments[pathSegments.length - 1] || "home";

  return <MainChat persona={pageName} />;
}
