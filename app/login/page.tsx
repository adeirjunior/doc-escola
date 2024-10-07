import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn, auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({searchParams}: {searchParams: { error: string}}) {
  const session = await auth()

  if(session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Coloque o login e a senha que te foram informados.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            action={async (formData) => {
              'use server';
              try {
                const data = Object.fromEntries(formData);
                await signIn("credentials", { ...data });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${process.env.NEXTAUTH_URL}${process.env.NEXT_PUBLIC_BASE_URL}/login?error=${error.type}`);
                }
                throw error;
              }
            }}
            className="w-full flex flex-col gap-2 items-end"
          >
            <Input name="username" type="text" placeholder='Seu login/nome de usuário' />
            <Input name="senha" type="password" placeholder='Senha' />
            {searchParams.error && <p className='text-red-500 w-full'>Credenciais incorretas</p>}
            <Button>Entrar</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
