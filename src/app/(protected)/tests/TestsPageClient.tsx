'use client'

import { useState } from "react";
import TestCard from "@/components/tests/TestCard";
import TestTemplateType from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";
import TestCreationDialog from "@/components/tests/TestCreationDialog";

export default function TestsPageClient({ testList, topicList }: { testList: TestTemplateType[], topicList: TopicType[] }) {
    const [tests, setTests] = useState<TestTemplateType[]>(testList);

    const handleDeleteTest = (id: string) => {
        setTests(tests.filter((t) => t.id !== id));
    }

    const handleCreateTest = (test: TestTemplateType) => {
        setTests(prevTests => [test, ...prevTests]);
    }

    return (
        <>
            <header className="flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl">My tests</h1>
                <TestCreationDialog topics={topicList} onCreate={handleCreateTest}/>
            </header>
            <section className="flex flex-col justify-items-center">
                <ul className="flex flex-row flex-wrap gap-9">
                    {
                        tests && tests.map((t) => (
                            <TestCard key={t.id} test={t} onDelete={handleDeleteTest}/>
                        ))
                    }
                </ul>
            </section>
        </>
    )
}
