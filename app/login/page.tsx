import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
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
              await signIn("credentials", formData, {
                redirectTo: '/'
              });
            }}
            className="w-full"
          >
            <Input name="username" type="text" placeholder='Seu login/nome de usuário' />
            <Input name="password" type="password" placeholder='senha'/>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
