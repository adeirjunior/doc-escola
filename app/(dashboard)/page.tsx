import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentosTable } from './documentos-table';
import { createDocumento, findAllDocumentos } from '@/lib/actions/document';
import { Status } from '@prisma/client';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function DocumentosPage({
  searchParams
}: {
    searchParams: { q: string | undefined; offset: number | undefined, status: Status | undefined };
}) {
  const session = await auth();
  const search = searchParams.q ?? '';
  const status = searchParams.status;
  const offset = searchParams.offset ?? 0;

  const { documentos, newOffset, totalDocumentos, limit } = await findAllDocumentos(
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
      <Tabs defaultValue={searchParams.status || "tudo"} >
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
              const documento = await createDocumento(session.user?.id as string);
              redirect(`/documentos/${documento.id}`);
            }}>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar Documento
                </span>
              </Button>
            </form>
          </div>
        </div>
        <TabsContent value="tudo">
        <Suspense fallback={<p>Carregando...</p>}>
          <DocumentosTable
            limit={limit}
            documentos={documentos}
            offset={newOffset ?? 0}
            totalDocumentos={totalDocumentos}
          />
        </Suspense>
        </TabsContent>
        <TabsContent value="ativo">
        <Suspense fallback={<p>Carregando...</p>}>
          <DocumentosTable
            limit={limit}
            documentos={documentos}
            offset={newOffset ?? 0}
            totalDocumentos={totalDocumentos}
          />
        </Suspense>
        </TabsContent>
        <TabsContent value="rascunho">
        <Suspense fallback={<p>Carregando...</p>}>
          <DocumentosTable
            limit={limit}
            documentos={documentos}
            offset={newOffset ?? 0}
            totalDocumentos={totalDocumentos}
          />
        </Suspense>
        </TabsContent>
        <TabsContent value="arquivado">
        <Suspense fallback={<p>Carregando...</p>}>
          <DocumentosTable
            limit={limit}
            documentos={documentos}
            offset={newOffset ?? 0}
            totalDocumentos={totalDocumentos}
          />
        </Suspense>
        </TabsContent>
      </Tabs>
    
    
  );
}
