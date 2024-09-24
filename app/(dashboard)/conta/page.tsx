import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findUsuarioById, updateUsuario } from "@/lib/actions/user";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function page() {
    const session = await auth()

    if (!session) {
        notFound()
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const usuario = await findUsuarioById(session.user?.id!)

    if(!usuario) {
        notFound()
    }

    return <Card>
        <CardHeader>
            <CardTitle>{usuario.nome ?? "Aluno"}</CardTitle>
            <CardDescription>
                Informações sobre esta conta
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form id="updateForm" action={async (formData) => {
                "use server"
                await updateUsuario(usuario.id, formData)
            }} className="flex flex-col gap-2 items-center w-full justify-between">
                <Input name="nome" placeholder="Nome" defaultValue={usuario?.nome ?? ""} />
                <Input name="username" placeholder="Nome de usuário" defaultValue={usuario?.username ?? ""} />
            </form>
        </CardContent>
        <CardFooter className="justify-end">
            <Button form="updateForm">Salvar</Button>
        </CardFooter>
    </Card>
}