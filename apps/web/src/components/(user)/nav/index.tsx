"use client";
import cn from "@/utils/cn";
import { LogOut } from "lucide-react";

interface SidebarProps {
  username?: string;
  userid?: string;
  onClick: () => void;
}

export default function Nav({
  username = "username",
  userid = "userid",
  onClick,
}: SidebarProps) {
  return (
    <section className="fixed top-0 z-20 flex h-18 w-screen items-center justify-between border-r border-emerald-500 px-2">
      <h1 className="font-subDisplay text-3xl font-semibold text-emerald-600">
        Task manager
      </h1>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-emerald-600 p-2",
          "bg-white shadow shadow-black/25",
        )}
      >
        <div className="size-10 rounded-full bg-red-400" />
        <div className="flex h-fit flex-col gap-0">
          <h2 className="text-gray-950">{username}</h2>
          <p className="-mt-1 text-xs text-gray-600">@{userid}</p>
        </div>
        <button
          className={cn(
            "ml-4 size-8 rounded-full border border-emerald-500/25 bg-emerald-50 px-2 text-xs",
            "transition-colors duration-100 hover:bg-emerald-500 hover:text-white",
            "flex items-center justify-center",
          )}
          onClick={onClick}
        >
          <LogOut />
        </button>
      </div>
    </section>
  );
}
