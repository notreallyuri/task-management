"use client";
import type { TRPCClientErrorLike } from "@trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserType } from "@acme/schemas";
import type { AppRouter } from "@acme/server";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import { trpc } from "@acme/client";
import { useState } from "react";
import cn from "@/utils/cn";

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const createMutation = trpc.user.create.useMutation({
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      setErrorMessage(err.message);
    },
  });

  const send = async (data: CreateUserType) => {
    try {
      await createMutation.mutateAsync(data);
      console.log("Success xDDDD");
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
        <h1 className="font-subDisplay text-3xl text-green-600">Sign Up</h1>
        <Input
          label="Username"
          {...register("username")}
          error={errors.username?.message}
        />
        <Input
          label="Email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          {...register("password")}
          error={errors.password?.message}
        />
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <button
          className={cn(
            "mt-6 flex h-10 w-full items-center justify-center rounded-full border",
            "transition-all duration-150",
            "font-display transition-colors duration-100",
            "border-green-500 text-green-500 hover:bg-green-100/40 active:bg-green-100",
          )}
          type="submit"
        >
          Sign up
        </button>
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </form>
    </>
  );
}
