import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (users && bcrypt.compareSync(credentials.password, users.password)) {
          return { id: users.id, name: users.username, email: users.email };
        } else {
          return null;
        }
      }
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    jwt: true
  },
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
});
