import { Check } from "lucide-react";
import { QuestionType } from "@/types/test/QuestionType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function QuestionDetailCard({ question }: { question: QuestionType }) {
    return (
        <Card className="flex flex-col gap-1 shadow-none hover:shadow-(--shadow-xs) transition-shadow border-gray-300">
            <CardHeader>
                <CardTitle>{question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col gap-2">
                    {
                        question.option.map((opt) => (
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
