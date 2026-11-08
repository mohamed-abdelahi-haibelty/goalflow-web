"use server";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { headers } from "next/headers";

const readSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export async function getUserSession() {
  return readSession();
}
