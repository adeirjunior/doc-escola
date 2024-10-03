"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

export default function GoBackwardButton() {
    const { back } = useRouter();
    return <Button onClick={() => back()}><ArrowBigLeft />Retornar</Button>;
}