"use client";
import { trpc } from "@acme/client";
import cn from "@/utils/cn";
import { CreateBoard, TaskBoard } from "../(user)/task";
import Nav from "../(user)/nav";
import { useRouter } from "next/navigation";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@acme/server";
import { useState } from "react";
import { X } from "lucide-react";
// Form
import Modal from "../(user)/modal";
import { Input, TextArea } from "../input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskType } from "@acme/schemas";

export function Auth() {
  const [active, setActive] = useState(false);
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: tasks, isError } = trpc.user.tasks.getByUser.useQuery(
    undefined,
    {
      onError: (err: TRPCClientErrorLike<AppRouter>) => {
        setTaskErrorMessage(err.message);
      },
    },
  );

  const user = trpc.user.getById.useQuery();
  const router = useRouter();
  const logout = trpc.user.logout.useMutation();
  const utils = trpc.useUtils();

  const handleExit = async () => {
    await logout.mutateAsync();
    await utils.auth.verify.invalidate();

    router.refresh();
  };

  // New Board Form

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createTaskSchema) });

  const taskMutation = trpc.user.tasks.createTask.useMutation({
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      setErrorMessage(err.message);
    },
    onSuccess: () => {
      utils.user.tasks.getByUser.invalidate();
      setActive(false);
    },
  });

  const send = async (data: CreateTaskType) => {
    try {
      await taskMutation.mutateAsync(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <main className="flex min-h-screen w-screen flex-col items-center justify-center">
        <Nav
          username={user.data?.username}
          userid={user.data?.id}
          onClick={handleExit}
        />
        <section className={cn("min-h-screen w-full pt-22")}>
          <div
            className={cn(
              "grid grid-cols-2 gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7",
              "auto-cols-min auto-rows-auto place-items-center",
            )}
          >
            <CreateBoard onClick={() => setActive((prev) => !prev)} />
            {(tasks ?? []).map((e) => (
              <TaskBoard
                title={e.title}
                content={e.description ?? ""}
                key={e.id}
                id={e.id}
              />
            ))}
            {isError && (
              <p className="text-error-300 place-self-start font-medium">
                {taskErrorMessage}
              </p>
            )}
          </div>
        </section>
      </main>
      {active && (
        <Modal>
          <form
            onSubmit={handleSubmit(send)}
            className="w-124 rounded-lg border border-emerald-500/25 bg-white p-2 shadow shadow-black/25"
          >
            <section className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-semibold text-emerald-600">
                Create new Task
              </h1>
              <button
                className={cn(
                  "flex size-5 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
                  "border-emerald-400 text-emerald-400",
                  "hover:border-emerald-400 hover:bg-emerald-400 hover:text-white",
                )}
                onClick={() => setActive((prev) => !prev)}
              >
                <X className="size-5" />
              </button>
            </section>
            <section className="space-y-2">
              <Input
                label="Title"
                required
                {...register("title")}
                error={errors.title?.message}
              />
              <TextArea
                label="Description"
                {...register("description")}
                error={errors.description?.message}
              />
            </section>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <button
              className={cn(
                "mt-5 flex h-10 w-full items-center justify-center rounded-full border",
                "transition-all duration-150",
                "font-display transition-colors duration-100",
                "border-green-500 text-green-500 hover:bg-green-100/40 active:bg-green-100",
              )}
              type="submit"
            >
              Create
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
