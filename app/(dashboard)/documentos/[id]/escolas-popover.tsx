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
import { Escola } from "@prisma/client";
import { School } from "lucide-react";
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
import { createEscola } from "@/lib/actions/school";
import { useSession } from "next-auth/react"

export function EscolasPopover({ escolas, defaultValue, name }: { name: string, escolas: Escola[], defaultValue: string | null }) {
    const [open, setOpen] = React.useState(false);
    const [selectedEscolas, setSelectedEscolas] = React.useState<Escola | null>(
        escolas.find((escola) => escola.id === defaultValue) || null
    );
    const [nomeEscola, setNomeEscola] = React.useState("");
    const [enderecoEscola, setEnderecoEscola] = React.useState("");
    const [loading, start] = React.useTransition();
    const { data: session } = useSession();
    
    React.useEffect(() => {
        const savedEscolaId = localStorage.getItem("selectedEscolaId");
        if (savedEscolaId && !defaultValue) {
            const escola = escolas.find((escola) => escola.id === savedEscolaId) || null;
            setSelectedEscolas(escola);
        }
    }, [defaultValue, escolas]);

    const handleCreateEscola = () => {
        try {
            start(async () => {
                if (!session?.user?.id) {
                    throw new Error("Erro ao criar escola");
                }
                const escola = await createEscola(session.user.id, enderecoEscola, nomeEscola, 'ativo');

                if (escola) {
                    setSelectedEscolas(escola);
                    localStorage.setItem("selectedEscolaId", escola.id);
                    setOpen(false);
                } else {
                    throw new Error("Erro ao criar escola");
                }
            });

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex w-full items-center space-x-4">
            <p className="text-sm text-muted-foreground">Escola</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[150px] justify-start"
                    >
                        {selectedEscolas ? (
                            <>
                                {selectedEscolas.nome}
                            </>
                        ) : (
                            <>+ Colocar escola</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Pesquisar escola..." />
                        <CommandList>
                            <CommandEmpty>
                                Sem escolas encontradas.{" "}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Criar escola</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Escola Municipal</DialogTitle>
                                            <DialogDescription>
                                                Registre uma nova escola aqui caso você não encontre no banco de dados.
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
                                                    value={nomeEscola}
                                                    onChange={(e) => setNomeEscola(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Endereço:
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="endereco"
                                                    className="col-span-3"
                                                    value={enderecoEscola}
                                                    onChange={(e) => setEnderecoEscola(e.target.value)}
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
                                            <Button onClick={handleCreateEscola} disabled={loading}>
                                                {loading ? "Salvando..." : "Salvar"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CommandEmpty>
                            <CommandGroup heading="Escolas">
                                {escolas.map((escola) => (
                                    <CommandItem
                                        key={escola.id}
                                        value={escola.nome!}
                                        onSelect={(value: string) => {
                                            const selected = escolas.find((s) => s.nome === value) || null;
                                            setSelectedEscolas(selected);
                                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                                            localStorage.setItem("selectedEscolaId", selected?.id!);
                                            setOpen(false);
                                        }}
                                    >
                                        <School
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                escola.id === selectedEscolas?.id
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{escola.nome}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <input type="hidden" name={name} value={selectedEscolas?.id || ""} />
        </div>
    );
}
