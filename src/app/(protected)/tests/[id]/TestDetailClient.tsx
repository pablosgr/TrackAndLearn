'use client';

import { useState } from "react";
import { TestType } from "@/types/test/TestType";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import { NewTestType } from "@/types/test/TestType";
import { useUser } from "@/components/context/userWrapper";
import TestDetailCard from "@/components/tests/TestDetailCard";
import TestDialog from "@/components/tests/TestDialog";
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
    adaptationList,
    testList,
    testTemplate
}: {
    adaptationList: AdaptationType[],
    testList: TestType[],
    testTemplate: TestTemplateType
}) {
    const [tests, setTests] = useState<TestType[]>(testList);
    const [selectedTab, setSelectedTab] = useState(tests[0]?.id.toString());
    const user = useUser();

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

    const createGeneratedTest = (newTest: TestType) => {
        setTests(prev => [...prev, newTest]);
    }

    const createTest = (newTest: TestType) => {
        const adaptation = adaptationList.find((item) => item.id === newTest.adaptation_id);

        const formattedTest = {
            ...newTest,
            adaptation_data: adaptation
            ? {
                name: adaptation.name,
                code: adaptation.code
            }
            : null,
            test_template: {
                teacher_id: Number(user.id)
            },
            question: []
        }

        setTests(prev => [...prev, formattedTest]);
    }

    const deleteTest = (testId: number) => {
        setTests(prev => prev.filter((t) => t.id !== testId));
        setSelectedTab(tests[0]?.id.toString());
    }

    const updateTest = (testId: number, data: NewTestType) => {
        const adaptation = adaptationList.find((item) => item.id === data.adaptation_id);

        setTests(prev =>
            prev.map((test) =>
                test.id === testId
                ? {
                    ...test,
                    name: data.name,
                    level: data.level,
                    time_limit: data.time_limit,
                    adaptation_id: data.adaptation_id,
                    adaptation_data: data.adaptation_id !== null && adaptation
                    ? {
                        name: adaptation.name,
                        code: adaptation.code
                    }
                    : null
                }
                : test
            )
        )
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="bg-(--color-accent) gap-2 py-6">
                <CardTitle className="text-2xl">{testTemplate.name} | {testTemplate.topic_data.name}</CardTitle>
                <CardDescription>Created on {new Date(testTemplate.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <div className="flex flex-row gap-5 items-center">
                    <TabsList>
                        {
                            tests.map((test) => (
                                <TabsTrigger key={test.id} value={test.id.toString()} className="hover:cursor-pointer">
                                    {test.name}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <TestDialog 
                        type="create"
                        templateName={testTemplate.name}
                        templateId={Number(testTemplate.id)}
                        adaptationList={adaptationList}
                        onCreate={createTest}
                    />
                    </div>
                    {
                        tests.map((test) => (
                            <TabsContent key={test.id} value={test.id.toString()}>
                                <TestDetailCard 
                                    test={test}
                                    templateName={testTemplate.name}
                                    adaptations={adaptationList}
                                    onQuestionDelete={deleteQuestion}
                                    onQuestionUpdate={updateQuestion}
                                    onQuestionCreate={createQuestion}
                                    onTestUpdate={updateTest}
                                    onTestDelete={deleteTest}
                                    onTestGenerate={createGeneratedTest}
                                />
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </CardContent>
        </Card>
    );
}
