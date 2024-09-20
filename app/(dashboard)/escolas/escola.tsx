import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, School } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Escola as EscolaType } from '@prisma/client';
import { deleteEscola } from '@/lib/actions/school';

export function Escola({ escola }: { escola: EscolaType }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <School width={32} height={32} className='text-muted-foreground mx-auto' />
      </TableCell>
      <TableCell className="font-medium">{escola.nome}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {escola.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{escola.endereco}</TableCell>
      <TableCell className="hidden md:table-cell">{escola.status}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => deleteEscola(escola.id)}>
                <button type="submit">Deletar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
