import { ComboboxPopover } from "@/components/status-popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findAllAlunos, findAlunoById, updateAluno } from "@/lib/actions/student";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const {alunos} = await findAllAlunos()

    return alunos.map((aluno) => ({
        id: aluno.id,
    }))
}

export default async function Page({ params }: { params: { id: string } }) {
    const aluno = await findAlunoById(params.id);

    if (!aluno) {
        notFound()
    }

    return <Card>
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
}