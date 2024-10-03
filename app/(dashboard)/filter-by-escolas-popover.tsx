"use client";

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
import { School, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getAllEscolasNames } from "@/lib/actions/school";

export function FilterByEscolasPopover() {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const defaultValue = searchParams.get('escola');
    const router = useRouter();
    const [selectedEscola, setSelectedEscola] = useState<string | null>(defaultValue);
    const [escolas, setEscolas] = useState<string[]>([]);
    const [loading, start] = useTransition(); 

    const search = searchParams.get('q') ?? '';
    const status = searchParams.get('status');
    const offset = searchParams.get('offset') ?? 0;

    useEffect(() => {
        start(async () => {
            const escolasNames = await getAllEscolasNames();
            setEscolas(escolasNames);
        });
    }, []);

    const updateQueryParams = (escola: string | null) => {
        start(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (escola) {
                params.set('escola', escola);
            } else {
                params.delete('escola');
            }

            if (search) params.set('q', search);
            if (status) params.set('status', status);
            params.set('offset', String(offset));

            router.push(`?${params.toString()}`);
        });
    };

    return (
        <div className="flex w-full items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="sm:min-w-40 justify-start"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        ) : selectedEscola ? (
                            <>
                                {selectedEscola}
                            </>
                        ) : (
                            <>Filtrar Por Escola</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Pesquisar escola..." />
                        <CommandList>
                            <CommandEmpty>
                                Sem escolas encontradas.
                            </CommandEmpty>
                            <CommandGroup heading="Escolas">
                                {escolas.map((escola) => (
                                    <CommandItem
                                        key={escola}
                                        value={escola}
                                        onSelect={(value: string) => {
                                            const selected = selectedEscola === value ? null : value;
                                            setSelectedEscola(selected);
                                            updateQueryParams(selected);
                                            setOpen(false);
                                        }}
                                    >
                                        <School
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                escola === selectedEscola
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{escola}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
