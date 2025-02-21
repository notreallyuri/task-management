"use client";
import { trpc } from "@acme/client";
import cn from "@/utils/cn";
import { CreateBoard, Task } from "../(user)/task";
import Nav from "../(user)/nav";

export function Auth({ userId }: { userId: string }) {
  const { data: tasks } = trpc.user.tasks.getByUser.useQuery({ userId });

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <Nav />
      <section className={cn("min-h-screen w-full pt-22")}>
        <div
          className={cn(
            "grid grid-cols-2 gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7",
            "auto-cols-min auto-rows-auto place-items-center",
          )}
        >
          <CreateBoard />
          {tasks && tasks.map((e) => <Task title={e.title} key={e.title} />)}
        </div>
      </section>
    </main>
  );
}
