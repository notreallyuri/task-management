import { cookies } from "next/headers";
import { Auth } from "@/components/LP/auth";
import { NotAuth } from "@/components/LP/notAuth";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuth = Boolean(cookieStore.get("Auth_key"));
  const userId = cookieStore.get("Auth_key")?.value;

  return <>{isAuth ? <Auth userId={userId ? userId : ""} /> : <NotAuth />}</>;
}
