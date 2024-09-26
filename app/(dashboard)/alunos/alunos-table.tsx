'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Aluno } from './aluno';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Aluno as AlunoType } from '@prisma/client';

export function AlunosTable({
  alunos,
  offset,
  totalAlunos,
  limit
}: {
    alunos: (AlunoType & {_count: {documentos: number}})[];
  offset: number;
  totalAlunos: number;
    limit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function prevPage() {
    const newOffset = Math.max(0, offset - limit * 2);

    const queryString = `?offset=${newOffset}${searchParams.get('q') ? `&q=${searchParams.get('q')}` : ''}${searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''}`;

    router.push(`/alunos${queryString}`)
  }

  function nextPage() {
    const queryString = `?offset=${offset}${searchParams.get('q') ? `&q=${searchParams.get('q')}` : ''}${searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''}`;

    router.push(`/alunos${queryString}`, { scroll: false });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos</CardTitle>
        <CardDescription>
          Visualize e gerencie todos os alunos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Imagem</span>
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Nome do Pai</TableHead>
              <TableHead className="hidden md:table-cell">
                Nome da Mãe
              </TableHead>
              <TableHead className="hidden md:table-cell">Documentos</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map((aluno) => (
              <Aluno key={aluno.id} aluno={aluno} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Mostrando{' '}
            <strong>
              {Math.min(offset - limit, totalAlunos) + 1}-{Math.min(offset, totalAlunos)}
            </strong>{' '}
            de <strong>{totalAlunos}</strong> alunos
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === limit}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + limit >= totalAlunos + limit}
            >
              Próxima
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
