"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createDocumento } from "@/lib/actions/document";
import { useSession } from "next-auth/react";

export default function NewDocumentButton() {
    const [loading, start] = useTransition();
    const router = useRouter();
    const { data: session } = useSession();

    const handleCreateDocument = async () => {
        start(async () => {
            try {
                if (!session?.user?.id) {
                    throw new Error("Erro ao criar aluno");
                }
                const documento = await createDocumento(session.user.id)

                router.push(`/documentos/${documento.id}`);
            } catch (error) {
                console.error(error);
            }
        })
    };

    return (
        <Button
            size="sm"
            className="h-8 gap-1"
            onClick={handleCreateDocument}
            disabled={loading}
        >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {loading ? "Criando..." : "Novo Documento"}
            </span>
        </Button>
    );
}
