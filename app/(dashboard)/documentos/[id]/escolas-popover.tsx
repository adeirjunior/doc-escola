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
import { Escola } from "@prisma/client"
import { School } from "lucide-react"
import Link from "next/link"

export function EscolasPopover({ escolas, defaultValue, name }: { name: string, escolas: Escola[], defaultValue: string | null }) {
    const [open, setOpen] = React.useState(false);
    const [selectedEscolas, setSelectedEscolas] = React.useState<Escola | null>(
        escolas.find((escola) => escola.id === defaultValue) || null
    );

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
                                <School width={32} height={32} className='text-muted-foreground mx-auto' />
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
                            <CommandEmpty>Sem escolas encontradas.{" "}<Link className="text-blue-500" href="/escolas">Adicione uma escola.</Link></CommandEmpty>
                            <CommandGroup>
                                {escolas.map((escola) => (
                                    <CommandItem
                                        key={escola.id}
                                        value={escola.id}
                                        onSelect={(value) => {
                                            const selected = escolas.find((s) => s.id === value) || null;
                                            setSelectedEscolas(selected);
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

            {/* Input oculto para o status */}
            <input type="hidden" name={name} value={selectedEscolas?.id || ""} />
        </div>
    );
}
