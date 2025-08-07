'use client'

import { useState } from "react";
import TemplateCard from "@/components/tests/TemplateCard";
import TemplateDialog from "@/components/tests/TemplateDialog";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";

export default function TestsPageClient({ 
    testList,
    topicList 
}: { 
    testList: TestTemplateType[],
    topicList: TopicType[]
}) {
    const [templates, setTemplates] = useState<TestTemplateType[]>(testList);
    const hasTests = templates.length > 0;

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
                {
                    hasTests &&
                        <TemplateDialog 
                            type="create"
                            topics={topicList}
                            onCreate={handleCreateTemplate}
                        />
                }
            </header>
            <section className={`w-full flex flex-col ${hasTests ? 'items-start' : 'h-full items-center'}`}>
                {
                    !hasTests
                    ? <div className="h-full flex flex-col justify-center gap-3">
                            <span className="text-lg">
                                Start creating a Test!
                            </span>
                            <TemplateDialog 
                                type="create"
                                topics={topicList}
                                onCreate={handleCreateTemplate}
                            />
                        </div>
                    : <ul className="flex flex-row flex-wrap gap-9">
                        {
                            templates && templates.map((t) => (
                                <li key={t.id}>
                                    <TemplateCard
                                        key={t.id}
                                        test={t}
                                        topics={topicList}
                                        onDelete={handleDeleteTemplate}
                                        onUpdate={handleUpdateTemplate}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                }
            </section>
        </>
    )
}
