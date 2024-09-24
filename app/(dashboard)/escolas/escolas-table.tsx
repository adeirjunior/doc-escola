"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { Escola } from './escola';
import { useRouter, useSearchParams } from 'next/navigation';
import { Escola as EscolaType } from '@prisma/client';

export function EscolasTable({
  escolas,
  offset,
  totalEscolas,
  limit
}: {
  escolas: (EscolaType & { totalAlunos: number })[];
  offset: number;
  totalEscolas: number;
  limit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function prevPage() {
    const newOffset = Math.max(0, offset - limit);

    const queryString = `?offset=${newOffset}${searchParams.get('q') ? `&q=${searchParams.get('q')}` : ''}${searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''}`;

    router.push(`/escolas${queryString}`);
  }

  function nextPage() {
    const newOffset = offset + limit;

    const queryString = `?offset=${newOffset}${searchParams.get('q') ? `&q=${searchParams.get('q')}` : ''}${searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''}`;

    router.push(`/escolas${queryString}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolas</CardTitle>
        <CardDescription>Visualize e gerencie todas as escolas.</CardDescription>
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
              <TableHead className="hidden md:table-cell">Endereço</TableHead>
              <TableHead className="hidden md:table-cell">Alunos</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escolas.map((escola) => (
              <Escola key={escola.id} escola={escola} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Mostrando{' '}
            <strong>
              {Math.min(offset + 1, totalEscolas)}-{Math.min(offset + limit, totalEscolas)}
            </strong>{' '}
            de <strong>{totalEscolas}</strong> escolas
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={offset + limit >= totalEscolas}
            >
              Próxima
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}