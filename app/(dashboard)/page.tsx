import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentosTable } from './documentos-table';
import { findAllDocumentos } from '@/lib/actions/document';

export default async function DocumentosPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { documentos, newOffset, totalDocumentos } = await findAllDocumentos(
    search,
    Number(offset)
  );

  if(!documentos) {
    throw new Error("Banco de dados não esta funcionando.")
  }

  return (
    <Tabs defaultValue="active">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="draft">Rascunho</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Arquivado
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Documento
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <DocumentosTable
          documentos={documentos}
          offset={newOffset ?? 0}
          totalDocumentos={totalDocumentos}
        />
      </TabsContent>
      <TabsContent value="active">
        <DocumentosTable
          documentos={documentos}
          offset={newOffset ?? 0}
          totalDocumentos={totalDocumentos}
        />
      </TabsContent>
      <TabsContent value="draft">
        <DocumentosTable
          documentos={documentos}
          offset={newOffset ?? 0}
          totalDocumentos={totalDocumentos}
        />
      </TabsContent>
      <TabsContent value="archived">
        <DocumentosTable
          documentos={documentos}
          offset={newOffset ?? 0}
          totalDocumentos={totalDocumentos}
        />
      </TabsContent>
    </Tabs>
  );
}
