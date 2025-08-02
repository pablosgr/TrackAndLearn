'use client';

import QuestionDetailCard from "./QuestionDetailCard";
import { TestType } from "@/types/test/TestType";
import { OptionType } from "@/types/test/OptionType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TestDetailCard({ 
    test,
    onDelete,
    onUpdate,
}: {
    test: TestType,
    onDelete: (testId: number, id: number) => void ,
    onUpdate: (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => void
}) {

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
                <h2 className="text-lg pl-5 font-semibold">Questions</h2>
                {
                    test.question.map((q) => (
                        <QuestionDetailCard 
                            key={q.id} 
                            question={q}
                            testId={test.id}
                            onDelete={onDelete} 
                            onUpdate={onUpdate} 
                        />
                    ))
                }
            </CardContent>
        </Card>
    )
}
