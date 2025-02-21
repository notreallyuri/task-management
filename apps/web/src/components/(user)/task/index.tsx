import cn from "@/utils/cn";
import Link from "next/link";

export function CreateBoard() {
  return (
    <button
      className={cn(
        "font-display size-48 cursor-pointer rounded border-2 border-dashed text-xl transition-colors",
        "border-emerald-500 text-emerald-500 hover:bg-emerald-200/25",
      )}
    >
      Create new Task
    </button>
  );
}

export type TaskProps = {
  title: string;
  content?: string;
  href?: string;
};

export function Task({ title, content, href }: TaskProps) {
  return (
    <Link
      href={href ? href : ""}
      className={cn(
        "flex size-48 flex-col gap-2 rounded border-2 p-2 text-left transition-all",
        "border-emerald-500 bg-white hover:scale-105 hover:bg-emerald-50",
      )}
    >
      <h1 className="font-display text-xl text-emerald-500">{title}</h1>
      <p className="font-body line-clamp-5 text-sm font-light text-wrap text-gray-800">
        {content}
      </p>
    </Link>
  );
}
