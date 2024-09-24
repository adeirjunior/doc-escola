import { ComboboxPopover } from "@/components/status-popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findEscolaById, updateEscola } from "@/lib/actions/school";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const escola = await findEscolaById(params.id);

    if(!escola) {
        notFound()
    }

    return <>
        <Card>
            <CardHeader>
                <CardTitle>{escola?.nome ?? "Escola"}</CardTitle>
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
                {escola.alunos.map(aluno => (<Card key={aluno.id}>{aluno.nome}</Card>))}
            </CardContent>
        </Card>
    </> 
}