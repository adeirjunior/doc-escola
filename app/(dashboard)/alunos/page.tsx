import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlunosTable } from './alunos-table';
import { createAluno, findAllAlunos } from '@/lib/actions/student';
import Link from 'next/link';
import { Status } from '@prisma/client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function AlunosPage({
  searchParams
}: {
    searchParams: { q: string | undefined; offset: number | undefined, status: Status | undefined };
}) {
  const session = await auth();
  const search = searchParams.q ?? '';
  const status = searchParams.status;
  const offset = searchParams.offset ?? 0;

  const { alunos, newOffset, totalAlunos, limit } = await findAllAlunos(
    search,
    status,
    Number(offset)
  );

  const newestOffset = Math.max(0, offset - limit * 2);

  const queryString = `?offset=${newestOffset}${searchParams.q ? `&q=${searchParams.q}` : ''}`;

  if (!session?.user?.id) {
    return <div>Unable to create school, user not logged in.</div>;
  }

  return (
    <Tabs defaultValue={searchParams.status || "tudo"}>
      <div className="flex items-center">
        <TabsList>
          <Link href={`${queryString}`} passHref>
            <TabsTrigger value="tudo">Todos</TabsTrigger>
          </Link>
          <Link href={`${queryString}&status=ativo`} passHref>
            <TabsTrigger value="ativo">Ativos</TabsTrigger>
          </Link>
          <Link href={`${queryString}&status=rascunho`} passHref>
            <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
          </Link>
          <Link href={`${queryString}&status=arquivado`} passHref>
            <TabsTrigger value="arquivado" className="hidden sm:flex">
              Arquivado
            </TabsTrigger>
          </Link>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <form action={async () => {
            "use server"
            const aluno = await createAluno(session.user?.id as string);
            redirect(`/alunos/${aluno.id}`);
          }}>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Aluno
            </span>
          </Button>
          </form>
        </div>
      </div>
      <TabsContent value="tudo">
          <Suspense fallback={<p>Carregando...</p>}>
            <AlunosTable
              alunos={alunos}
              limit={limit}
              offset={newOffset ?? 0}
              totalAlunos={totalAlunos}
            />
          </Suspense>
      </TabsContent>
      <TabsContent value="ativo">
          <Suspense fallback={<p>Carregando...</p>}>
            <AlunosTable
              alunos={alunos}
              limit={limit}
              offset={newOffset ?? 0}
              totalAlunos={totalAlunos}
            />
          </Suspense>
      </TabsContent>
      <TabsContent value="rascunho">
          <Suspense fallback={<p>Carregando...</p>}>
            <AlunosTable
              alunos={alunos}
              limit={limit}
              offset={newOffset ?? 0}
              totalAlunos={totalAlunos}
            />
          </Suspense>
      </TabsContent>
      <TabsContent value="arquivado">
          <Suspense fallback={<p>Carregando...</p>}>
            <AlunosTable
              alunos={alunos}
              limit={limit}
              offset={newOffset ?? 0}
              totalAlunos={totalAlunos}
            />
          </Suspense>
      </TabsContent>
    </Tabs>
  );
}
