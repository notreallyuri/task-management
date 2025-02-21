"use client";
import { Auth } from "@/components/LP/auth";
import { NotAuth } from "@/components/LP/notAuth";
import { trpc } from "@acme/client";
import { Loader2 } from "lucide-react";

export interface authRes {
  isAuthenticated: boolean;
  userId: string;
}

export default function Home() {
  const { data, isLoading } = trpc.auth.verify.useQuery();

  if (isLoading) {
    return (
      <main className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-emerald-600" />
      </main>
    );
  }

  return <>{data?.isAuthenticated ? <Auth /> : <NotAuth />}</>;
}
