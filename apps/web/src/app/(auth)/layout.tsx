import cn from "@/utils/cn";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LayoutAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Link
        href={"/"}
        className={cn(
          "absolute top-5 left-5",
          "group size-10 rounded-full border font-display text-sm font-medium transition-all ease-in-out",
          "inline-flex items-center justify-center",
          "border-emerald-400 text-emerald-400",
          "hover:w-24 hover:gap-2 hover:px-2"
        )}
      >
        <ArrowLeft className="size-5" />
        <p className="hidden group-hover:inline">Return</p>
      </Link>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-28">
        <div
          className={cn(
            "min-h-80 w-105 rounded-2xl border bg-white/25 shadow shadow-black/25 border-green-300  p-4"
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
