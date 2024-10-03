import { ComboboxPopover } from "@/components/status-popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findAllAlunos, findAlunoById, updateAluno } from "@/lib/actions/student";
import { Status } from "@prisma/client";
import { DocumentosTable } from "app/(dashboard)/documentos-table";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const {alunos} = await findAllAlunos()

    return alunos.map((aluno) => ({
        id: aluno.id,
    }))
}

export default async function page({ params, searchParams }: { params: { id: string }, searchParams: { q: string | undefined; offset: number | undefined, status: Status | undefined }; }) {
    const search = searchParams.q ?? '';
    const offset = searchParams.offset ?? 0;

    const {documentos, totalDocumentos, limit, newOffset, ...aluno} = await findAlunoById(params.id, search, offset, 'ativo');

    if (!aluno) {
        notFound()
    }

    return <><Card>
        <CardHeader>
            <CardTitle>{aluno?.nome ?? "Aluno"}</CardTitle>
            <CardDescription>
                Informações sobre este aluno
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form id="updateForm" action={async (formData) => {
                "use server"
                await updateAluno(params.id, formData)
            }} className="flex flex-col gap-2 items-center w-full justify-between">
                <Input name="nome" placeholder="Nome" defaultValue={aluno?.nome ?? ""} />
                <Input name="nome_pai" placeholder="Nome do pai" defaultValue={aluno?.nome_pai ?? ""} />
                <Input name="nome_mae" placeholder="Nome da mãe" defaultValue={aluno?.nome_mae ?? ""} />
                <ComboboxPopover name="status" defaultValue={aluno?.status} />
            </form>
        </CardContent>
        <CardFooter className="justify-end">
            <Button form="updateForm">Salvar</Button>
        </CardFooter>
    </Card>
        <Card>
            <CardHeader>
                <CardTitle>Documentos Registrados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <DocumentosTable documentos={documentos} limit={limit} offset={newOffset ?? 0} totalDocumentos={totalDocumentos}/>
            </CardContent>
        </Card></>
}