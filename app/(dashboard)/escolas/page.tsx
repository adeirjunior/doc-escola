import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createEscola, findAllEscolas } from '@/lib/actions/school';
import { EscolasTable } from './escolas-table';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EscolasPage({
    searchParams
}: {
    searchParams: { q: string | undefined; offset: string | undefined };
}) {
    const session = await auth();
    const search = searchParams.q ?? '';
    const offset = searchParams.offset ? Number(searchParams.offset) : 0;

    const { escolas, newOffset, totalEscolas } = await findAllEscolas(
        search,
        offset
    );

    if (!session?.user?.id) {
        return <div>Unable to create school, user not logged in.</div>;
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
                    <form action={async () => {
                        "use server"
                        const escola = await createEscola(session.user?.id as string);
                        redirect(`/escolas/${escola.id}`);
                    }}>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Adicionar Escola
                            </span>
                        </Button>
                    </form>
                </div>
            </div>
            <TabsContent value="all">
                <EscolasTable
                    escolas={escolas}
                    offset={newOffset ?? 0}
                    totalEscolas={totalEscolas}
                />
            </TabsContent>
            <TabsContent value="active">
                <EscolasTable
                    escolas={escolas}
                    offset={newOffset ?? 0}
                    totalEscolas={totalEscolas}
                />
            </TabsContent>
            <TabsContent value="draft">
                <EscolasTable
                    escolas={escolas}
                    offset={newOffset ?? 0}
                    totalEscolas={totalEscolas}
                />
            </TabsContent>
            <TabsContent value="archived">
                <EscolasTable
                    escolas={escolas}
                    offset={newOffset ?? 0}
                    totalEscolas={totalEscolas}
                />
            </TabsContent>
        </Tabs>
    );
}

