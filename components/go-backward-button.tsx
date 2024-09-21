"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowBigLeft } from "lucide-react";

export default function GoBackwardButton() {
    const { back } = useRouter();
    return <Button onClick={() => back()}><ArrowBigLeft />Retornar</Button>;
}