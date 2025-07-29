'use client'

import { useState } from "react";
import TestCard from "@/components/tests/TestCard";
import TestTemplateType from "@/types/test/TestTemplateType";
import TestCreationDialog from "@/components/tests/TestCreationDialog";

export default function TestsPageClient({ data }: { data: TestTemplateType[] }) {
    const [tests, setTests] = useState<TestTemplateType[]>(data);

    const handleDelete = (id: string) => {
        setTests(tests.filter((t) => t.id !== id));
    }

    return (
        <>
            <header className="flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl">My tests</h1>
                <TestCreationDialog />
            </header>
            <section className="flex flex-col justify-items-center">
                <ul className="flex flex-row flex-wrap gap-9">
                    {
                        tests && tests.map((t) => (
                            <TestCard key={t.id} test={t} onDelete={handleDelete}/>
                        ))
                    }
                </ul>
            </section>
        </>
    )
}
