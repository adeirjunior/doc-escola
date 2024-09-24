"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

function capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function DashboardBreadcrumb() {
    const segments = useSelectedLayoutSegments();

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/?status=ativo">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.length === 0 ? (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Documentos</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : (
                    segments.map((segment, index) => {
                        const isLast = index === segments.length - 1;
                        return (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{capitalizeFirstLetter(segment)}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={`/${segment}?status=ativo`}>{capitalizeFirstLetter(segment)}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </>
                        );
                    })
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
