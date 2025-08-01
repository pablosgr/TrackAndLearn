import { Check, Trash } from "lucide-react";
import { useState } from "react";
import { deleteQuestionById } from "@/app/(protected)/tests/actions/delete";
import QuestionEditDialog from "./QuestionEditDialog";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function QuestionDetailCard({ question, onDelete }: { question: QuestionType, onDelete: (id: string) => void }) {
    const [questionData, setQuestionData] = useState<QuestionType>(question);
    const [options, setOptions] = useState<OptionType[]>(question.option);

    const handleQuestionUpdate = (data: EditQuestionType, newOptions: OptionType[]) => {
        setQuestionData((prev) => ({
            ...prev,
            question_text: data.question_text,
            options_number: data.options_number
        }));

        setOptions(newOptions);
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(question.id.toString());
        await deleteQuestionById(question.id);
    }

    return (
        <Card className="flex flex-col gap-0 shadow-none hover:shadow-(--shadow-xs) transition-shadow border-gray-300">
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>{questionData.question_text}</CardTitle>
                <div className="flex flex-row gap-1">
                    <QuestionEditDialog question={question} onUpdate={handleQuestionUpdate}/>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <CardAction className="p-2 hover:bg-(--color-destructive) hover:cursor-pointer rounded-lg transition-colors">
                                <Trash size={22}/>
                            </CardAction>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Question will be removed permanently. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col gap-2">
                    {
                        options.map((opt) => (
                            <li key={opt.id} className="flex flex-row gap-4 items-center">
                                {opt.option_text}
                                { opt.is_correct ? <Check size={20} className="text-green-600"/> : '' }
                            </li>
                        ))
                    }
                </ul>
            </CardContent>
        </Card>
    )
}
