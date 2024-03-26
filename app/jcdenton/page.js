"use client";
import { Boss } from "@/components/component/Boss";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/");
  const pageName = pathSegments[pathSegments.length - 1] || "home";

  return <Boss persona={pageName} />;
}
