"use client";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@acme/schemas";
import { trpc } from "@acme/client";
import cn from "@/utils/cn";
import type { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@acme/server";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = trpc.user.login.useMutation({
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      setErrorMessage(err.message);
    },
  });

  const send = async (data: LoginData) => {
    try {
      const res = await loginMutation.mutateAsync(data);

      console.log("Login Success:", res);
      router.push("/");
    } catch (err) {
      console.error("Login Failed:", err);
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage("An unexpected error ocurred");
    }
  };

  if (errorMessage) console.error("Error Message:", errorMessage);

  return (
    <>
      <form
        onSubmit={handleSubmit(send)}
        className="flex h-full w-full flex-col space-y-2"
      >
        <h1 className="font-subDisplay text-3xl text-green-600">Sign In</h1>
        <Input
          label="Email"
          id="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          id="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="mt-auto inline-flex space-x-2">
          <input
            type="checkbox"
            id="keepIn"
            className="text-white accent-emerald-500"
          />
          <label
            htmlFor="keepIn"
            className="border-green-200 text-gray-600 select-none"
          >
            Want to keep the session ?
          </label>
        </div>
        <button
          className={cn(
            "mt-auto flex h-10 w-full items-center justify-center rounded-full border",
            "transition-all duration-150",
            "font-display transition-colors duration-100",
            "border-green-500 text-green-500 hover:bg-green-100/40 active:bg-green-100",
          )}
          type="submit"
        >
          Sign in
        </button>
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </form>
    </>
  );
}
