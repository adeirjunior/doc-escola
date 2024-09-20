import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex justify-center items-start md:items-center p-8">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Página não encontrada</CardTitle>
                    <CardDescription>
                        Não foi possivel encontrar a requisição.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/">Voltar para página principal</Link>
                </CardFooter>
            </Card>
        </div>
    )
}