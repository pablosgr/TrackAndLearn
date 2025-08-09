import { TestType } from "@/types/test/TestType";
import { TestResultType } from "@/types/test/TestResultType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function StudentResultClient({ 
    test,
    testResult
}: {
    test: TestType,
    testResult: TestResultType
}) {
    return (
        <Card className="w-full h-full">
            <CardHeader className="bg-(--color-accent) gap-2 py-6">
                <CardTitle className="text-2xl">Result for {test.name}</CardTitle>
                <CardDescription className="text-md">{test.level}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {
                    test.question.map((q) => {
                        const studentResponse = testResult.response.find((r) => r.question_id === q.id);

                        return (
                            <article key={q.id}>
                                <Card className="shadow-none rounded-none border-none">
                                    <CardHeader>
                                        <CardTitle>{q.index_order}. {q.question_text}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="flex flex-col gap-4">
                                            {
                                                q.option.map((opt) => (
                                                    <li key={opt.id}>
                                                        <Card
                                                            className={`
                                                                py-6 border-2 border-gray-200
                                                                shadow-none
                                                                ${
                                                                    opt.is_correct
                                                                    ? 'bg-green-300 border-green-500'
                                                                    : ''
                                                                }
                                                                ${
                                                                    (studentResponse?.selected_option_id === opt.id && !opt.is_correct)
                                                                    ? 'bg-red-300 border-red-500'
                                                                    : ''
                                                                }
                                                            `}
                                                        >
                                                            <CardContent>
                                                                <span>{opt.option_text}</span>
                                                            </CardContent>
                                                        </Card>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </CardContent>
                                </Card>
                            </article>
                        )
                    })
                }
                <p className="w-full text-center self-center text-2xl py-6 border-t-1 border-gray-300">
                    Final score: <strong>{testResult.score}</strong>
                </p>
            </CardContent>
        </Card>
    )
}
