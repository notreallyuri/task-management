"use client";
import { useState } from "react";
import { trpc } from "@acme/client";
import { LoaderCircle } from "lucide-react";

export default function DashDev() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: users, refetch } = trpc.user.getAll.useQuery();

  const { data: tasks } = trpc.user.tasks.getByUser.useQuery(
    { userId: selectedUser! },
    { enabled: !!selectedUser },
  );

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <main className="h-screen w-screen">
      <section className="p-6">
        <h1 className="mb-6 text-4xl font-bold text-emerald-600">
          Admin Dashboard
        </h1>

        {/* User Selection */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-emerald-600">
            Select a user
          </h2>
          {users ? (
            <div className="mt-2 grid min-h-20 grid-cols-2 gap-4 rounded-lg border border-emerald-500">
              {users?.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between border-b p-2"
                >
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className="rounded-lg border border-emerald-600 px-4 py-2 text-emerald-600 hover:bg-emerald-100 focus:outline-none"
                  >
                    {user.username}
                  </button>
                  <button
                    onClick={() => deleteUser.mutate({ id: user.id })}
                    disabled={deleteUser.isLoading}
                    className="rounded-lg border border-emerald-600 px-4 py-2 text-emerald-600 hover:bg-emerald-100 focus:outline-none"
                  >
                    {deleteUser.isLoading ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))}
            </div>
          ) : (
            <div className="flex min-h-20 items-center justify-center rounded-lg border border-emerald-500">
              <LoaderCircle className="animate-spin text-emerald-600" />
            </div>
          )}
        </div>

        {/* Tasks List */}
        {selectedUser && tasks ? (
          <div>
            <h2 className="text-xl font-semibold text-emerald-600">Tasks</h2>
            <ul className="mt-2 space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-md border border-emerald-500 bg-amber-100 px-4 py-2"
                >
                  <p className="text-gray-700">{task.title}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Select a user to view their tasks</p>
        )}
      </section>
    </main>
  );
}
