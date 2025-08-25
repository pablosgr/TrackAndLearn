import { QuestionType } from "@/types/test/QuestionType";
import { Controller, Control } from "react-hook-form";
import { FormMessage, FormItem } from "../ui/form";
import { TakeTestFormValues } from "./TakeTestCard";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TakeQuestionCard({
    question,
    control
} : {
    question: QuestionType,
    control: Control<TakeTestFormValues>
}) {

    return (
        <Card className="shadow-none border-none">
            <CardHeader>
                <CardTitle className="text-xl">{question.index_order}. {question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
                <Controller
                    control={control}
                    name={`answers.${question.id}`}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <ul className="flex flex-col gap-4">
                                {
                                    question.option.map((opt) => {
                                        const isSelected = field.value === String(opt.id);

                                        return (
                                            <li 
                                                key={opt.id} 
                                                onClick={() => field.onChange(String(opt.id))}
                                            >
                                                <Card 
                                                    className={`
                                                        text-lg
                                                        py-6 border-2 border-gray-200
                                                        shadow-none transition-colors
                                                        hover:cursor-pointer
                                                        ${isSelected 
                                                            ? 'bg-secondary/60 border-secondary' 
                                                            : 'hover:bg-secondary/20'
                                                        }
                                                    `}
                                                >
                                                    <CardContent>
                                                        <span>{opt.option_text}</span>
                                                    </CardContent>
                                                </Card>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <FormMessage>
                                {fieldState.error?.message ? 'Question needs to be answered' : ''}
                            </FormMessage>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
