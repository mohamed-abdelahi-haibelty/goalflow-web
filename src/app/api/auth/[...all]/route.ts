import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);
export const GET = handlers.GET;

export async function POST(request: Request) {
  // The anonymous plugin does not enforce an Origin check itself.
  const path = new URL(request.url).pathname;
  if (
    path.endsWith("/sign-in/anonymous") ||
    path.endsWith("/delete-anonymous-user")
  ) {
    const origin = request.headers.get("origin");
    const expected = process.env.BETTER_AUTH_URL;
    if (!expected || origin !== new URL(expected).origin) {
      return new Response(null, { status: 403 });
    }
  }
  return handlers.POST(request);
}
