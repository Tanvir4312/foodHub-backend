import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const isProduction = process.env.BETTER_AUTH_URL?.startsWith("https://");

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // trustedOrigins: [process.env.APP_URL!],
  trustedOrigins: [
    process.env.APP_URL!,
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL!,
  ],

  cookies: {
    session_token: {
      attributes: {
        sameSite: "Lax",
        secure: process.env.BETTER_AUTH_URL?.startsWith("https://") || false,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      },
    },
  },
  // -------------------------

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      phone_number: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  advanced: {
    trustedProxyHeaders: true,
    disableOriginCheck: true,
    disableCSRFCheck: true, // Last resort for local 403 issues
  },
});
