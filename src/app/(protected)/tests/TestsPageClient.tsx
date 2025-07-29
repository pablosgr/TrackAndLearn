'use client'

import { useState } from "react";
import TestCard from "@/components/tests/TestCard";
import Link from "next/link";
import TestTemplateType from "@/types/test/TestTemplateType";

export default function TestsPageClient({ data }: { data: TestTemplateType[] }) {
    const [tests, setTests] = useState<TestTemplateType[]>(data);

    const handleDelete = (id: string) => {
        setTests(tests.filter((t) => t.id !== id));
    }

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
                            <TestCard test={t} onDelete={handleDelete}/>
                        </Link>
                    ))
                }
            </ul>
        </section>
        </>
    )
}
