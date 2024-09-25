import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findAllDocumentos, findDocumentoById, updateDocumento } from "@/lib/actions/document";
import { notFound } from "next/navigation";
import { AlunosPopover } from "./alunos-popover";
import { findAlunos } from "@/lib/actions/student";
import { ComboboxPopover } from "@/components/status-popover";
import { EscolasPopover } from "./escolas-popover";
import { findEscolas } from "@/lib/actions/school";
import DocumentPDFViewer from "./document-pdf-viewer";
import NewDocumentButton from "./new-document";

export async function generateStaticParams() {
    const { documentos } = await findAllDocumentos()

    return documentos.map((documento) => ({
        id: documento.id,
    }))
}

export default async function page({ params }: { params: { id: string } }) {
    const documento = await findDocumentoById(params.id);
    const alunos = await findAlunos()
    const escolas = await findEscolas()

    if (!documento) {
        notFound()
    }


    return <form id="updateForm" action={async (formData) => {
        "use server"
        await updateDocumento(params.id, formData)
    }}>
        <Card>
            <CardHeader className="flex flex-row justify-center">
                <div>
                    <CardTitle>{documento?.aluno?.nome ? `DOCUMENTO DE ${documento?.aluno?.nome}` : "DOCUMENTO"}</CardTitle>
                    <CardDescription>
                        Informações sobre este documento
                    </CardDescription>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <NewDocumentButton />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 items-center w-full justify-between">
                <Input name="codigo" type="number" max={99} placeholder="Código" defaultValue={documento?.codigo ?? ""} />
                <Input name="ano_final" type="number" maxLength={4} max={3000} placeholder="Ano final" defaultValue={documento?.ano_final ?? ""} />
                <AlunosPopover alunos={alunos} name="id_aluno" defaultValue={documento?.id_aluno} />
                <EscolasPopover name="id_escola" escolas={escolas} defaultValue={documento.id_escola} />
                <ComboboxPopover name="status" defaultValue={documento.status} />
            </CardContent>
            <CardFooter className="justify-end">
                <Button form="updateForm">Salvar</Button>
            </CardFooter>
        </Card>
        <DocumentPDFViewer name="file" url={documento.url!} />
    </form>
}
