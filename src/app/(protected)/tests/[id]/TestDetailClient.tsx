'use client';

import { useState, useEffect } from "react";
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
    const [selectedTab, setSelectedTab] = useState<string>(tests[0]?.id.toString());
    const selectedTest = tests.find(t => t.id.toString() === selectedTab);
    const user = useUser();
    const MAX_TESTS = 3;

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
                <div className="h-full flex flex-col lg:flex-row gap-5">
                    <section className="w-full lg:w-52 h-full flex flex-col gap-5">
                        {
                            tests.length < MAX_TESTS &&
                            <TestDialog
                                type="create"
                                templateName={testTemplate.name}
                                templateId={Number(testTemplate.id)}
                                adaptationList={adaptationList}
                                onCreate={createTest}
                            />
                        }
                        <Card className="flex flex-col gap-0 shadow-none border-gray-300 rounded-lg">
                            <CardHeader>
                                <CardTitle>Tets details</CardTitle>
                            </CardHeader>
                            <CardContent className="w-full flex flex-col gap-3">
                                {
                                    selectedTest &&
                                    <>
                                    <p className="text-sm text-gray-500">
                                        Level: { selectedTest.level ? selectedTest.level : 'Level not defined' }
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Time Limit: { selectedTest.time_limit ? selectedTest.time_limit + ' minutes' : 'None' }
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Adaptation: { selectedTest.adaptation_data ? selectedTest.adaptation_data.code : 'Not adapted' }
                                    </p>
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </section>
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
                        <TabsList>
                            {
                                tests.map((test) => (
                                    <TabsTrigger
                                        key={test.id}
                                        value={test.id.toString()}
                                        className="hover:cursor-pointer max-w-30 sm:max-w-40 lg:max-w-60"
                                    >
                                        <span className="truncate">{test.name}</span>
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {
                            tests.map((test) => (
                                <TabsContent key={test.id} value={test.id.toString()}>
                                    <TestDetailCard
                                        test={test}
                                        testCount={tests.length}
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
                </div>
            </CardContent>
        </Card>
    );
}
