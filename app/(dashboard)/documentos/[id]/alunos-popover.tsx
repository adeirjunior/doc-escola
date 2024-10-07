"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Aluno } from "@prisma/client";
import { Users2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createAluno } from "@/lib/actions/student";
import { useSession } from "next-auth/react";

export function AlunosPopover({ alunos, defaultValue, name }: { name: string, alunos: Aluno[], defaultValue?: string | null }) {
    const [open, setOpen] = React.useState(false);
    const [selectedAlunos, setSelectedAlunos] = React.useState<Aluno | null>(
        alunos.find((aluno) => aluno.id === defaultValue) || null
    );
    const [nomeAluno, setNomeAluno] = React.useState("");
    const [nomePai, setNomePai] = React.useState("");
    const [nomeMae, setNomeMae] = React.useState("");
    const [loading, start] = React.useTransition();
    const { data: session } = useSession();

    const handleCreateAluno = () => {
        try {
            start(async () => {
                if (!session?.user?.id) {
                    throw new Error("Erro ao criar aluno");
                }
                const aluno = await createAluno(session.user.id, nomeAluno, nomePai, nomeMae, 'ativo');

                if (aluno) {
                    setSelectedAlunos(aluno);
                    setOpen(false);
                } else {
                    throw new Error("Erro ao criar aluno");
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex w-full items-center space-x-4">
            <p className="text-sm text-muted-foreground">Aluno</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[150px] justify-start"
                    >
                        {selectedAlunos ? (
                            <>
                                {selectedAlunos.nome}
                            </>
                        ) : (
                            <>+ Colocar aluno</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Pesquisar aluno..." />
                        <CommandList>
                            <CommandEmpty>
                                Sem alunos encontrados.{" "}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Criar aluno</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Aluno Novo</DialogTitle>
                                            <DialogDescription>
                                                Registre um novo aluno aqui caso não encontre no banco de dados.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Nome:
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="nome"
                                                    className="col-span-3"
                                                    value={nomeAluno}
                                                    onChange={(e) => setNomeAluno(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Nome Pai:
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="nome_pai"
                                                    className="col-span-3"
                                                    value={nomePai}
                                                    onChange={(e) => setNomePai(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Nome Mãe:
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="nome_mae"
                                                    className="col-span-3"
                                                    value={nomeMae}
                                                    onChange={(e) => setNomeMae(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Status:
                                                </Label>
                                                <p className="col-span-3">Status será <Badge>Ativo</Badge> por padrão</p>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleCreateAluno} disabled={loading}>
                                                {loading ? "Salvando..." : "Salvar"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CommandEmpty>
                            <CommandGroup heading="Alunos">
                                {alunos.map((aluno) => (
                                    <CommandItem
                                        key={aluno.id}
                                        value={aluno.nome!}
                                        onSelect={(value: string
                                        ) => {
                                            const selected = alunos.find((s) => s.nome === value) || null;
                                            setSelectedAlunos(selected);
                                            setOpen(false);
                                        }}
                                    >
                                        <Users2
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                aluno.id === selectedAlunos?.id
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{aluno.nome}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Input oculto para o status */}
            <input type="hidden" name={name} value={selectedAlunos?.id || ""} />
        </div>
    );
}
