"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Aluno } from "@prisma/client"
import { Users2 } from "lucide-react"
import Link from "next/link"

export function AlunosPopover({ alunos, defaultValue, name }: {name: string, alunos: Aluno[], defaultValue: string | null }) {
    const [open, setOpen] = React.useState(false);
    const [selectedAlunos, setSelectedAlunos] = React.useState<Aluno | null>(
        alunos.find((aluno) => aluno.id === defaultValue) || null
    );

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
                                <Users2 className='text-muted-foreground mx-auto' />
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
                            <CommandEmpty>Sem alunos encontrados.{" "}<Link className="text-blue-500" href="/alunos">Adicione um aluno.</Link></CommandEmpty>
                            <CommandGroup>
                                {alunos.map((aluno) => (
                                    <CommandItem
                                        key={aluno.id}
                                        value={aluno.id}
                                        onSelect={(value) => {
                                            const selected = alunos.find((s) => s.id === value) || null;
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
