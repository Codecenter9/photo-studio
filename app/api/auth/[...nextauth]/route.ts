
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/model/User"; 
import { compare } from "bcryptjs";
import dbConnection from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnection();

        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          phone:user.phone,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;   
        token.role = user.role; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id; 
        session.user.role = token.role; 
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
