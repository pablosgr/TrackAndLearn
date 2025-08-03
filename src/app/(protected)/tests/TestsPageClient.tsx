'use client'

import { useState } from "react";
import TestCard from "@/components/tests/TestCard";
import TestTemplateType from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";
import TemplateDialog from "@/components/tests/TemplateDialog";

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
            <header className="w-full flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl">My tests</h1>
                <TemplateDialog topics={topicList} onCreate={handleCreateTest}/>
            </header>
            <section className="w-full flex flex-col justify-items-start">
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
