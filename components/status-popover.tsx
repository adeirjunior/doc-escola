"use client"

import * as React from "react"
import {
    ArrowUpCircle,
    CheckCircle2,
    LucideIcon,
    XCircle,
} from "lucide-react"

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
import { Status as StatusType } from '@prisma/client';

type Status = {
    value: StatusType
    label: string
    icon: LucideIcon
}

const statuses: Status[] = [
    {
        value: "ativo",
        label: "Ativo",
        icon: ArrowUpCircle,
    },
    {
        value: "rascunho",
        label: "Rascunho",
        icon: CheckCircle2,
    },
    {
        value: "arquivado",
        label: "Arquivado",
        icon: XCircle,
    },
]

export function ComboboxPopover({ defaultValue, name }: { defaultValue: StatusType; name: string }) {
    const [open, setOpen] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
        statuses.find((status) => status.value === defaultValue) || null
    );

    return (
        <div className="flex w-full items-center space-x-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[150px] justify-start"
                    >
                        {selectedStatus ? (
                            <>
                                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                                {selectedStatus.label}
                            </>
                        ) : (
                            <>+ Colocar status</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Pesquisar status..." />
                        <CommandList>
                            <CommandEmpty>Sem resultados encontrados.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={(value) => {
                                            const selected = statuses.find((s) => s.value === value) || null;
                                            setSelectedStatus(selected);
                                            setOpen(false);
                                        }}
                                    >
                                        <status.icon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                status.value === selectedStatus?.value
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{status.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Input oculto para o status */}
            <input type="hidden" name={name} value={selectedStatus?.value || ""} />
        </div>
    );
}
