'use client'

import { useState } from "react";
import TemplateCard from "@/components/tests/TemplateCard";
import TemplateDialog from "@/components/tests/TemplateDialog";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";

export default function TestsPageClient({ testList, topicList }: { testList: TestTemplateType[], topicList: TopicType[] }) {
    const [templates, setTemplates] = useState<TestTemplateType[]>(testList);

    const handleDeleteTemplate = (id: string) => {
        setTemplates(templates.filter((t) => t.id !== id));
    }

    const handleCreateTemplate = (template: TestTemplateType) => {
        setTemplates(prevTests => [template, ...prevTests]);
    }

    const handleUpdateTemplate = (template: TestTemplateType) => {
        const topic = topicList.find((topic) => topic.id === Number(template.topic_id));

        setTemplates(prev =>
            prev.map((t) => 
                t.id === template.id
                ? {
                    ...t,
                    name: template.name,
                    topic_id: template.topic_id,
                    topic_data: {
                        name: topic?.name ?? t.topic_data.name
                    }
                }
                : t
            )
        );
    }

    return (
        <>
            <header className="w-full flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl">My Tests</h1>
                <TemplateDialog 
                    type="create"
                    topics={topicList}
                    onCreate={handleCreateTemplate}
                />
            </header>
            <section className="w-full flex flex-col justify-items-start">
                <div className="flex flex-row flex-wrap gap-9">
                    {
                        templates && templates.map((t) => (
                            <TemplateCard
                                key={t.id}
                                test={t}
                                topics={topicList}
                                onDelete={handleDeleteTemplate}
                                onUpdate={handleUpdateTemplate}
                            />
                        ))
                    }
                </div>
            </section>
        </>
    )
}
