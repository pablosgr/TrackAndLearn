'use client'

import { useState } from "react";
import TemplateCard from "@/components/tests/TemplateCard";
import TemplateDialog from "@/components/tests/TemplateDialog";
import GenerateTestDialog from "@/components/tests/GenerateTestDialog";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";
import { AdaptationType } from "@/types/test/AdaptationType";

export default function TestsPageClient({ 
    testList,
    topicList,
    adaptationList,
}: { 
    testList: TestTemplateType[],
    topicList: TopicType[],
    adaptationList: AdaptationType[]
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
            <header className="w-full flex flex-row flex-wrap items-center justify-between pb-10">
                <h1 className="text-3xl">My Tests</h1>
                {
                    hasTests &&
                    <div className="flex flex-row gap-5">
                        <GenerateTestDialog 
                            adaptationList={adaptationList}
                            topicList={topicList}
                            onGenerate={handleCreateTemplate}
                        />
                        <TemplateDialog 
                            type="create"
                            topics={topicList}
                            onCreate={handleCreateTemplate}
                        />
                    </div>
                }
            </header>
            <section className={`w-full flex flex-col @container ${!hasTests && 'h-full items-center'}`}>
                {
                    !hasTests
                    ? <div className="h-full flex flex-col justify-center gap-3">
                            <span className="text-lg text-center">
                                Start creating a Test!
                            </span>
                            <div className="flex flex-row gap-3">
                                <GenerateTestDialog 
                                    adaptationList={adaptationList}
                                    topicList={topicList}
                                    onGenerate={handleCreateTemplate}
                                />
                                <TemplateDialog 
                                    type="create"
                                    topics={topicList}
                                    onCreate={handleCreateTemplate}
                                />
                            </div>
                        </div>
                    : <ul className="flex flex-row flex-wrap gap-10 justify-center @6xl:justify-start">
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
