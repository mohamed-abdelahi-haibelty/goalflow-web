import { anonymous } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { transferGuestWorkspace } from "@/server/guest";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  plugins: [
    anonymous({
      generateName: () => "Guest",
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await transferGuestWorkspace(anonymousUser.user.id, newUser.user.id);
      },
    }),
  ],
  rateLimit: {
    enabled: true,
    customRules: { "/sign-in/anonymous": { window: 60, max: 5 } },
  },
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
});
