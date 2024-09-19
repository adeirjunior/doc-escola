import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import { signInSchema } from './zod';
import { findUsuarioByUsername } from './actions/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { username, password } = await signInSchema.parseAsync(credentials);

          const user = await findUsuarioByUsername(username);

          if (!user) {
            throw new Error("Usuário não existe.");
          }

          if (password !== user.senha) {
            throw new Error("Senha errada.");
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Erro de validação Zod:", error);
            return null;
          }
          console.error("Erro de autenticação:", error);
          return null;
        }
      },
    }),
  ],
});
