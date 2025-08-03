'use client';

import QuestionDetailCard from "./QuestionDetailCard";
import { TestType } from "@/types/test/TestType";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import QuestionDialog from "./QuestionDialog";
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
    onCreate,
}: {
    test: TestType,
    onDelete: (testId: number, id: number) => void,
    onUpdate: (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => void,
    onCreate: (testId: number, newQuestion: QuestionType) => void
}) {
    
    return (
        <Card className="w-full shadow-none border-0">
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-3">
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
                </div>
                <QuestionDialog type="create" testId={test.id} onCreate={onCreate} />
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
