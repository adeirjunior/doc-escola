import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Aluno } from '@prisma/client';
import { deleteAluno } from '@/lib/actions/student';

export function Product({ aluno }: { aluno: Aluno }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src='/placeholder-user.jpg'
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{aluno.nome}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {aluno.criadoEm.toLocaleDateString("pt-BR")}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${aluno.nome_mae}`}</TableCell>
      <TableCell className="hidden md:table-cell">{aluno.nome_pai}</TableCell>
      <TableCell className="hidden md:table-cell">
        {aluno.atualizadoEm.toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => deleteAluno(aluno.id)}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
