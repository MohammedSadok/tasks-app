import Link from "next/link";

import { useLockBody } from "@/hooks/use-lock-body";
import { cn } from "@/lib/utils";
import { Command } from "lucide-react";

export function MobileNav() {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Command />
          <span className="font-bold">Taskonomy</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href={"/"}
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
          >
            Tasks
          </Link>
          <Link
            href={"/statistics"}
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
            )}
          >
            Statistics
          </Link>
        </nav>
      </div>
    </div>
  );
}
