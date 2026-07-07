import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Re-read plan/role from the DB at most this often, so Stripe webhooks and
// admin grants take effect without forcing a sign-out/sign-in.
const REFRESH_MS = 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.plan = (user as { plan?: string }).plan ?? "free";
        token.role = (user as { role?: string }).role ?? "user";
        token.refreshedAt = Date.now();
        return token;
      }
      const last = (token.refreshedAt as number) ?? 0;
      if (token.id && Date.now() - last > REFRESH_MS) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { plan: true, role: true, subscriptionStatus: true },
          });
          if (fresh) {
            token.plan = fresh.plan;
            token.role = fresh.role;
          }
        } catch {}
        token.refreshedAt = Date.now();
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.plan = (token.plan as string) ?? "free";
        session.user.role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
});
