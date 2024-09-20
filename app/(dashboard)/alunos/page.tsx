import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlunosTable } from './alunos-table';
import { findAllAlunos } from '@/lib/actions/student';

export default async function AlunosPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { alunos, newOffset, totalAlunos } = await findAllAlunos(
    search,
    Number(offset)
  );

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
              Adicionar Aluno
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <AlunosTable
          alunos={alunos}
          offset={newOffset ?? 0}
          totalAlunos={totalAlunos}
        />
      </TabsContent>
      <TabsContent value="active">
        <AlunosTable
          alunos={alunos}
          offset={newOffset ?? 0}
          totalAlunos={totalAlunos}
        />
      </TabsContent>
      <TabsContent value="draft">
        <AlunosTable
          alunos={alunos}
          offset={newOffset ?? 0}
          totalAlunos={totalAlunos}
        />
      </TabsContent>
      <TabsContent value="archived">
        <AlunosTable
          alunos={alunos}
          offset={newOffset ?? 0}
          totalAlunos={totalAlunos}
        />
      </TabsContent>
    </Tabs>
  );
}
