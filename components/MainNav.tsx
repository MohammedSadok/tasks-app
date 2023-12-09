"use client";
import { cn } from "@/lib/utils";
import { Command, FileText, PieChart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import * as React from "react";
import { MobileNav } from "./MobileNav";
export function MainNav() {
  const path = usePathname();
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Command />
        <span className="hidden font-bold sm:inline-block">Taskonomy</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link href="/">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/" ? "bg-accent" : "transparent"
            )}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </span>
        </Link>
      </nav>
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <X /> : <Command />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && <MobileNav />}
    </div>
  );
}
