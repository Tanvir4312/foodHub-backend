import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// If your Prisma file is located elsewhere, you can change the path

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   trustedOrigins : [process.env.APP_URL!],
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "CUSTOMER",
//         required: false,
//       },
//       phone_number : {
//         type : "string",
//         required : false
//       },
//       status : {
//         type : "string",
//         defaultValue : "ACTIVE",
//         required : false
//       },
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     autoSignIn : false
//   },
// });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL!],

  // cookies: {
  //   session_token: {
  //     attributes: {
  //       sameSite: "None",
  //       secure: true,
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24 * 7,
  //     },
  //   },
  // },
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
});
