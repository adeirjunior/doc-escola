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
import { Documento } from './documento';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Aluno, Documento as DocumentoType, Escola } from '@prisma/client';

export function DocumentosTable({
  documentos,
  offset,
  totalDocumentos
}: {
    documentos: (DocumentoType & { aluno: Aluno | null; escola: Escola | null })[];
  offset: number;
  totalDocumentos: number;
}) {
  const router = useRouter();
  const documentsPerPage = 5;

  function prevPage() {
    if (offset > 0) {
      router.push(`/?offset=${offset - documentsPerPage}`, { scroll: false });
    }
  }

  function nextPage() {
    if (offset + documentsPerPage < totalDocumentos) {
      router.push(`/?offset=${offset + documentsPerPage}`, { scroll: false });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>
          Visualize e gerencie todos os documentos.
        </CardDescription>
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
              {Math.max(1, offset + 1)}-{Math.min(offset + documentsPerPage, totalDocumentos)}
            </strong>{' '}
            de <strong>{totalDocumentos}</strong> documentos
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              type="button"
              disabled={offset <= 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              type="button"
              disabled={offset + documentsPerPage >= totalDocumentos}
            >
              Próximo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
