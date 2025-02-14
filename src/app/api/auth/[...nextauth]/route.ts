import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';
import { logSecurityEvent } from '@/lib/audit';

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async signIn({ user, account, profile }) {
      await logSecurityEvent('user_login_attempt', {
        user: user.email,
        provider: account?.provider
      });
      return true;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    }
  }
});

export { handler as GET, handler as POST }; 