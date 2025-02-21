import cn from "@/utils/cn";
import Link from "next/link";

export function NotAuth() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex min-h-1/4 flex-col items-center justify-between">
        <div className="text-center">
          <h1 className="font-display text-7xl font-semibold text-emerald-600">
            Task Manager
          </h1>
          <h2 className="font-subDisplay text-2xl font-semibold text-green-400">
            Improve your daily taks
          </h2>
        </div>

        <div className="flex gap-4">
          <Link
            href={"/sign-in"}
            className={cn(
              "group font-subDisplay relative flex w-40 items-center justify-center overflow-hidden rounded-full",
              "cursor-pointer bg-emerald-500 transition-colors hover:bg-emerald-500/60",
            )}
          >
            <p className="text-2xl text-white duration-200">Sign in</p>
          </Link>
          <Link
            href={"/sign-up"}
            className={cn(
              "group font-subDisplay relative flex w-40 items-center justify-center overflow-hidden rounded-full",
              "cursor-pointer border-2 border-emerald-600",
            )}
          >
            <p className="text-2xl text-emerald-600 duration-150 group-hover:text-white">
              Sign up
            </p>
            <div
              className={cn(
                "absolute -z-10 box-border h-0 w-0 rounded-full bg-emerald-600",
                "transition-all duration-300 group-hover:h-full group-hover:w-full",
              )}
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
