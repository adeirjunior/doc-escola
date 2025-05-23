import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import { signInSchema } from '@/lib/zod';
import { findUsuarioByUsername } from '@/lib/actions/user';
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      username: { label: "Nome de Usuário", type: "text" },
      senha: { label: "Senha", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        const { username, senha } = await signInSchema.parseAsync(credentials);

        const user = await findUsuarioByUsername(username);

        if (!user) {
          throw new Error("Usuário não existe.");
        }

        if (senha !== user.senha) {
          throw new Error("Senha errada.");
        }

        return user;
      } catch (error) {
        if (error instanceof ZodError) {
          console.error("Erro de validação Zod:", error.errors);
        } else if (error instanceof Error) {
          console.error("Erro de autenticação:", error.message);
        } else {
          console.error("Erro desconhecido", error);
        }
        return null;
      }
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    error: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub ?? "",
      };

      return session;
    }

  },
  trustHost: true
});
