import { beforeEach, expect, it, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: {} }));
vi.mock("better-auth/next-js", () => ({
  toNextJsHandler: () => ({
    GET: vi.fn(),
    POST: vi.fn(() => new Response(null, { status: 200 })),
  }),
}));
import { POST } from "@/app/api/auth/[...all]/route";
beforeEach(() => {
  vi.stubEnv("BETTER_AUTH_URL", "https://goalflow.example");
});
it.each(["/sign-in/anonymous", "/delete-anonymous-user"])(
  "rejects missing and foreign origins on %s",
  async (path) => {
    for (const origin of [undefined, "https://evil.example"]) {
      const response = await POST(
        new Request(`https://goalflow.example/api/auth${path}`, {
          method: "POST",
          headers: origin ? { origin } : {},
        }),
      );
      expect(response.status).toBe(403);
    }
  },
);
it("accepts the configured app origin", async () => {
  expect(
    (
      await POST(
        new Request("https://goalflow.example/api/auth/sign-in/anonymous", {
          method: "POST",
          headers: { origin: "https://goalflow.example" },
        }),
      )
    ).status,
  ).toBe(200);
});
