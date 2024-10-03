import { ComboboxPopover } from "@/components/status-popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findAllEscolas, findEscolaById, updateEscola } from "@/lib/actions/school";
import { findAllAlunosWhereSchoolId } from "@/lib/actions/student";
import { auth } from "@/lib/auth";
import { Status } from "@prisma/client";
import { AlunosTable } from "app/(dashboard)/alunos/alunos-table";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const { escolas } = await findAllEscolas()

    return escolas.map((escola) => ({
        id: escola.id,
    }))
}

export default async function Page({ params, searchParams }: { params: { id: string }, searchParams: { q: string | undefined; offset: number | undefined, status: Status | undefined }; }) {
    const escola = await findEscolaById(params.id, 'ativo');
    const session = await auth();
    const search = searchParams.q ?? '';
    const offset = searchParams.offset ?? 0;

    const { alunos, totalAlunos, newOffset, limit } = await findAllAlunosWhereSchoolId(params.id, search, offset);

    if (!session?.user?.id) {
        return <div>Unable to create school, user not logged in.</div>;
    }

    if (!escola) {
        notFound()
    }

    return <>
        <Card>
            <CardHeader>
                <CardTitle>{escola?.nome ? `ESCOLA MUNICIPAL ${escola.nome}` : "ESCOLA MUNICIPAL"}</CardTitle>
                <CardDescription>
                    Informações sobre esta escola
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="updateForm" action={async (formData) => {
                    "use server"
                    await updateEscola(params.id, formData)
                }} className="flex flex-col gap-2 items-center w-full justify-between">
                    <Input name="nome" placeholder="Nome" defaultValue={escola?.nome ?? ""} />
                    <Input name="endereco" placeholder="Endereço" defaultValue={escola?.endereco ?? ""} />
                    <ComboboxPopover name="status" defaultValue={escola?.status} />
                </form>
            </CardContent>
            <CardFooter className="justify-end">
                <Button form="updateForm">Salvar</Button>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Alunos Registrados</CardTitle>
            </CardHeader>
            <CardContent>
                <AlunosTable alunos={alunos} limit={limit} offset={newOffset ?? 0} totalAlunos={totalAlunos} />
            </CardContent>
        </Card>
    </>
}