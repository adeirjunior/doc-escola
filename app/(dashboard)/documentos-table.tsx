"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { Documento } from './documento';
import { useRouter, useSearchParams } from 'next/navigation';
import { Aluno, Escola, Documento as DocumentoType } from '@prisma/client';

export function DocumentosTable({
  documentos,
  offset,
  totalDocumentos,
  limit
}: {
  documentos: (DocumentoType & { aluno: Aluno | null; escola: Escola | null })[];
  offset: number;
  totalDocumentos: number;
  limit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function prevPage() {
    const newOffset = Math.max(0, offset - limit * 2);

    const queryString = `?offset=${newOffset}${searchParams.get('q') ? `&q=${searchParams.get('q')}` : ''}${searchParams.get('escola') ? `&escola=${searchParams.get('escola')}` : ''}${searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''}`;

    router.push(`/${queryString}`)
  }

  function nextPage() {
    const queryString = `?offset=${offset}${searchParams.get('q') ? `&q=${searchParams.get('q')}` : ''}${searchParams.get('escola') ? `&escola=${searchParams.get('escola')}` : ''}${searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''}`;

    router.push(`/${queryString}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>Visualize e gerencie todos os documentos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Imagem</span>
              </TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Ano Final</TableHead>
              <TableHead className="hidden md:table-cell">Escola</TableHead>
              <TableHead className="hidden md:table-cell">Aluno</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.map((documento) => (
              <Documento key={documento.id} documento={documento} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Mostrando{' '}
            <strong>
              {Math.min(offset - limit, totalDocumentos) + 1}-{Math.min(offset, totalDocumentos)}
            </strong>{' '}
            de <strong>{totalDocumentos}</strong> documentos
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
              disabled={offset + limit >= totalDocumentos + limit}
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
