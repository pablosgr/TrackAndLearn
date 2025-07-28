'use client'

import { useState } from "react";
import TestCard from "@/components/tests/TestCard";
import Link from "next/link";
import TestTemplateType from "@/types/test/TestTemplateType";

export default function TestsPageClient({ data }: { data: TestTemplateType[] }) {
    const [tests] = useState<TestTemplateType[]>(data);

    return (
        <>
        <header>
            <h1 className="pb-10 text-3xl">My tests</h1>
        </header>
        <section className="flex flex-col justify-items-center">
            <ul className="flex flex-row flex-wrap gap-9">
                {
                    tests && tests.map((t) => (
                        <Link href={`/tests/${t.id}`} key={t.id}>
                            <TestCard test={t} />
                        </Link>
                    ))
                }
            </ul>
        </section>
        </>
    )
}
