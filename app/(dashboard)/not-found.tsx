import GoBackwardButton from '@/components/go-backward-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Página não encontrada</CardTitle>
                <CardDescription>
                    Não foi possível encontrar as informações que voce esta requisitando.
                </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="justify-end">
                <GoBackwardButton/>
            </CardFooter>
        </Card>
    )
}