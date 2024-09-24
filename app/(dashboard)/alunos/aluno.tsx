import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Users2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Aluno as AlunoType } from '@prisma/client';
import { arquiveAluno } from '@/lib/actions/student';
import Link from 'next/link';

export function Aluno({ aluno }: { aluno: AlunoType & { _count: { documentos: number } } }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Users2 width={32} height={32} className='text-muted-foreground mx-auto' />
      </TableCell>
      <TableCell className="font-medium">{aluno.nome}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {aluno.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{aluno.nome_pai}</TableCell>
      <TableCell className="hidden md:table-cell">{aluno.nome_mae}</TableCell>
      <TableCell className="hidden md:table-cell">
        {aluno._count.documentos}
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
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/alunos/${aluno.id}`}>Editar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => arquiveAluno(aluno.id)}>
                <button type="submit">Arquivar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
