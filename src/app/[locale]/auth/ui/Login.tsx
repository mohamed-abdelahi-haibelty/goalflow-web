import Link from "next/link";
import LoginForm from "./LoginForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary/50 via-background to-accent/10 overflow-hidden">
      {/* Main content */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Header  */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              GoalFlow
            </h1>
            <p className="text-sm text-muted-foreground">
              Kanban + Pomodoro for Peak Productivity
            </p>
          </div>

          {/* Login card */}
          <LoginForm />

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Terms of Use
              </Link>
              {" and "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
