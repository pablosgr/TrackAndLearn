import { TestResponseType } from "@/types/test/TestResponseType";
import { QuestionType } from "@/types/test/QuestionType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function StudentsAnswersCard(
{
    type,
    questions,
    studentResponses
}: {
    type: 'correct' | 'incorrect',
    questions: QuestionType[],
    studentResponses: TestResponseType[]
}) {
    return (
        <Card className="shadow-xs">
            <CardHeader className="pb-0">
                <CardTitle>
                    {
                        type === 'correct'
                        ? 'Correct'
                        : 'Incorrect'
                    }
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {
                    questions.map((q) => {
                        const questionResult = studentResponses.find((i) => i.question_id == q.id);
                        
                        return (type === 'correct' ? questionResult?.is_correct : !questionResult?.is_correct)
                        ? (
                            <div key={q.id} className="flex flex-col gap-1">
                                <p className="font-semibold">{q.index_order}. {q.question_text}</p>
                                <ul className="p-3 flex flex-col gap-2">
                                    {
                                        q.option.map((o) => (
                                            <li 
                                                key={o.id}
                                                className={`
                                                    ${o.is_correct && 'text-green-500 font-semibold'}
                                                    ${
                                                        (o.id === questionResult?.selected_option_id && !o.is_correct)
                                                        && 'text-red-600 font-semibold'
                                                    }
                                                `}
                                            >
                                                {o.option_text}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )
                        : ''
                    })
                }
            </CardContent>
        </Card>
    )
}
