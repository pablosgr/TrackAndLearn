'use client';

import { useState } from "react";
import QuestionDetailCard from "./QuestionDetailCard";
import { TestType } from "@/types/test/TestType";
import { QuestionType } from "@/types/test/QuestionType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TestDetailCard({ test }: { test: TestType }) {
    const [questions, setQuestions] = useState<QuestionType[]>(test.question);

    const handleQuestionDelete = (id: string) => {
        setQuestions(questions.filter((q) => q.id.toString() !== id));
    }

    return (
        <Card className="w-full shadow-none border-0">
            <CardHeader>
                <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                <CardDescription>
                    {
                        test.time_limit
                        ? `This test has a time limit of ${test.time_limit} minutes`
                        : 'This test has no time limit.'
                    }
                    { 
                        test.adaptation_data 
                        ? ` This test is adapted for ${test.adaptation_data.name}.` 
                        : ' This test is not adapted.' 
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {
                    questions.map((q) => (
                        <QuestionDetailCard key={q.id} question={q} onDelete={handleQuestionDelete} />
                    ))
                }
            </CardContent>
        </Card>
    )
}
