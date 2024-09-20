import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileText, MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Aluno, Documento as DocumentoType, Escola } from '@prisma/client';
import { deleteDocumento } from '@/lib/actions/document';

export function Documento({ documento }: { documento: DocumentoType & {aluno: Aluno, escola: Escola} }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <FileText width={32} height={32} className='text-muted-foreground mx-auto'/>
      </TableCell>
      <TableCell className="font-medium">{documento.codigo}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {documento.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{documento.ano_final}</TableCell>
      <TableCell className="hidden md:table-cell">{documento.escola.nome}</TableCell>
      <TableCell className="hidden md:table-cell">
        {documento.aluno.nome}
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
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => deleteDocumento(documento.id)}>
                <button type="submit">Deletar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
