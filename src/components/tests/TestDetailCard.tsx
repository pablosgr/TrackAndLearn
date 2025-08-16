'use client';

import QuestionDetailCard from "./QuestionDetailCard";
import GenerateVersionDialog from "./GenerateVersionDialog";
import { useRouter } from "next/navigation";
import { deleteTestById } from "@/app/(protected)/tests/actions/delete";
import { TestType } from "@/types/test/TestType";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import { NewTestType } from "@/types/test/TestType";
import CustomAlertDialog from "../CustomAlertDialog";
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
    templateName,
    adaptations,
    onQuestionDelete,
    onQuestionUpdate,
    onQuestionCreate,
    onTestUpdate,
    onTestDelete,
    onTestGenerate,
}: {
    test: TestType,
    templateName: string,
    adaptations: AdaptationType[],
    onQuestionDelete: (testId: number, id: number) => void,
    onQuestionUpdate: (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => void,
    onQuestionCreate: (testId: number, newQuestion: QuestionType) => void,
    onTestUpdate: (testId: number, data: NewTestType) => void,
    onTestDelete: (testId: number) => void,
    onTestGenerate: (newTest: TestType) => void
}) {
    const router = useRouter();

    const handleTestDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onTestDelete(test.id);
        await deleteTestById(test.id);
        router.refresh();
    }
    
    return (
        <Card className="shadow-none border-0">
            <CardHeader className="flex flex-row justify-between items-center flex-wrap gap-5">
                <div className="flex flex-col gap-3">
                    <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    {
                        !test.adaptation_id &&
                        <GenerateVersionDialog 
                            baseTest={test}
                            adaptationList={adaptations}
                            onGenerate={onTestGenerate}
                        />
                    }
                    {
                        test.question.length < 9 &&
                        <QuestionDialog type="create" testId={test.id} onCreate={onQuestionCreate} />
                    }
                    <TestDialog 
                        type="update"
                        templateName={templateName}
                        templateId={test.template_id}
                        test={test}
                        adaptationList={adaptations}
                        onUpdate={onTestUpdate}
                    />
                    {
                        test.adaptation_id &&
                        <CustomAlertDialog
                            description={`
                                ${ test.adaptation_data?.code } version will be permanently removed. This action cannot be undone.
                            `}
                            onDelete={handleTestDelete}
                        />
                    }
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold">
                    {
                        test.question.length === 0
                        ? 'Test is empty..'
                        : 'Questions'
                    }
                </h2>
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
