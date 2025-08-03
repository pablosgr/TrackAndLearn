'use client';

import QuestionDetailCard from "./QuestionDetailCard";
import { TestType } from "@/types/test/TestType";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import { NewTestType } from "@/types/test/TestType";
import QuestionDialog from "./QuestionDialog";
import TestDialog from "./TestDialog";
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
    adaptations,
    onQuestionDelete,
    onQuestionUpdate,
    onQuestionCreate,
    onTestUpdate,
}: {
    test: TestType,
    adaptations: AdaptationType[],
    onQuestionDelete: (testId: number, id: number) => void,
    onQuestionUpdate: (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => void,
    onQuestionCreate: (testId: number, newQuestion: QuestionType) => void,
    onTestUpdate: (testId: number, data: NewTestType) => void
}) {
    
    return (
        <Card className="w-full shadow-none border-0">
            <CardHeader className="flex flex-row justify-between items-center flex-wrap gap-5">
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
                <div className="flex flex-row gap-3">
                    <TestDialog 
                        type="update"
                        templateId={test.template_id}
                        test={test}
                        adaptationList={adaptations}
                        onUpdate={onTestUpdate}
                    />
                    <QuestionDialog type="create" testId={test.id} onCreate={onQuestionCreate} />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <h2 className="text-lg pl-5 font-semibold">Questions</h2>
                {
                    test.question.map((q) => (
                        <QuestionDetailCard 
                            key={q.id} 
                            question={q}
                            testId={test.id}
                            onQuestionDelete={onQuestionDelete} 
                            onQuestionUpdate={onQuestionUpdate} 
                        />
                    ))
                }
            </CardContent>
        </Card>
    )
}
