import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteQuestionById } from "@/app/(protected)/tests/actions/delete";
import QuestionDialog from "./QuestionDialog";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import CustomAlertDialog from "../CustomAlertDialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


export default function QuestionDetailCard({ 
    question,
    testId,
    onQuestionDelete,
    onQuestionUpdate
}: { 
    question: QuestionType,
    testId: number,
    onQuestionDelete: (testId: number, id: number) => void,
    onQuestionUpdate: (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => void
}) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuestionDelete(testId, question.id);
        await deleteQuestionById(question.id);
        router.refresh();
    }

    return (
        <Card
            className={`
                flex flex-col gap-0 shadow-none hover:shadow-(--shadow-xs)
                transition-shadow border-gray-300 dark:border-white/30
            `}
        >
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>{question.question_text}</CardTitle>
                <div className="flex flex-row gap-1">
                    <QuestionDialog type="update" testId={testId} question={question} onUpdate={onQuestionUpdate}/>
                    <CustomAlertDialog
                        description={`
                            Question will be permanently removed. This action cannot be undone.
                        `}
                        onDelete={handleDelete}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col gap-2">
                    {
                        question.option.map((opt) => (
                            <li key={opt.id} className="flex flex-row gap-4 items-center">
                                {opt.option_text}
                                { opt.is_correct && <Check size={20} className="text-green-600"/> }
                            </li>
                        ))
                    }
                </ul>
            </CardContent>
        </Card>
    )
}
