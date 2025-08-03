'use client';

import { useState } from "react";
import { TestType } from "@/types/test/TestType";
import TestTemplateType from "@/types/test/TestTemplateType";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import TestDetailCard from "@/components/tests/TestDetailCard";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger 
} from "@/components/ui/tabs";

export default function TestDetailClient({
    testList,
    testTemplate
}: { 
    testList: TestType[],
    testTemplate: TestTemplateType
}) {
    const [tests, setTests] = useState<TestType[]>(testList);

    const deleteQuestion = (testId: number, id: number) => {
        setTests(prev =>
            prev.map(test =>
                test.id === testId
                    ? {
                        ...test,
                        question: test.question.filter(q => q.id !== id)
                    }
                    : test
            )
        );
    }

    const updateQuestion = (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => {
        setTests(prev =>
            prev.map(test =>
                test.id === testId
                    ? {
                        ...test,
                        question: test.question.map(q =>
                            q.id === id
                                ? { 
                                    ...q,
                                    question_text: data.question_text,
                                    options_number: data.options_number,
                                    option: newOptions
                                }
                                : q
                        )
                    }
                    : test
            )
        );
    }

    const createQuestion = (testId: number, newQuestion: QuestionType) => {
        setTests(prev => 
            prev.map((test) => 
                test.id === testId 
                ? {
                    ...test,
                    question: [...test.question, newQuestion]
                }
                : test
            )
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="bg-(--color-accent) gap-2 py-6">
                <CardTitle className="text-2xl">{testTemplate.name} | {testTemplate.topic_data.name}</CardTitle>
                <CardDescription>Created on {new Date(testTemplate.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={tests[0].id.toString()}>
                    <TabsList>
                        {
                            tests.map((test) => (
                                <TabsTrigger key={test.id} value={test.id.toString()} className="hover:cursor-pointer">
                                    {test.name}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    {
                        tests.map((test) => (
                            <TabsContent key={test.id} value={test.id.toString()}>
                                <TestDetailCard 
                                    test={test}
                                    onDelete={deleteQuestion}
                                    onUpdate={updateQuestion}
                                    onCreate={createQuestion}
                                />
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </CardContent>
        </Card>
    );
}
