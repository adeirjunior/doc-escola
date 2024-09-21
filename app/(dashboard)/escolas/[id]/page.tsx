import { ComboboxPopover } from "@/components/status-popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findEscolaById } from "@/lib/actions/school";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const escola = await findEscolaById(params.id);

    if(!escola) {
        notFound()
    }

    return <Card>
        <CardHeader>
            <CardTitle>{escola?.nome}</CardTitle>
            <CardDescription>
                Informações sobre
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form className="flex flex-col gap-2 items-center w-full justify-between">
                <Input name="nome" placeholder="Nome" defaultValue={escola?.nome} />
                <Input name="endereco" placeholder="Endereço" defaultValue={escola?.endereco} />
                <ComboboxPopover  defaultValue={escola?.status}/>
            </form>
        </CardContent>
        <CardFooter className="justify-end">
            <Button>Salvar</Button>
        </CardFooter>
    </Card>
}