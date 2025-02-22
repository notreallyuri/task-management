"use client";
import cn from "@/utils/cn";
import { trpc } from "@acme/client";
import { X } from "lucide-react";

export function CreateBoard({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={cn(
        "font-display size-48 cursor-pointer rounded border-2 border-dashed text-xl transition-colors",
        "border-emerald-500 text-emerald-500 hover:bg-emerald-200/25",
      )}
      onClick={onClick}
    >
      Create new Task
    </button>
  );
}

export type TaskProps = {
  id: string;
  title: string;
  content?: string;
};

export function TaskBoard({ id, title, content }: TaskProps) {
  const utils = trpc.useUtils();

  const deleteMutation = trpc.user.tasks.deleteTask.useMutation({
    onSuccess: () => {
      utils.user.tasks.getByUser.invalidate();
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutateAsync({ id });
    }
  };

  return (
    <div
      className={cn(
        "flex size-48 flex-col gap-2 rounded border-2 p-2 text-left transition-all",
        "border-emerald-500 bg-white hover:scale-105 hover:bg-emerald-50",
      )}
    >
      <h1 className="font-display text-xl text-emerald-500">{title}</h1>
      <p className="font-body line-clamp-5 text-sm font-light text-wrap text-gray-800">
        {content}
      </p>
      <button
        onClick={handleDelete}
        className="absolute flex items-center justify-center -top-2 -right-2 size-5 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
      >
        <X className="" />
      </button>
    </div>
  );
}
