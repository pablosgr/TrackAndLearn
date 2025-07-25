import { TestType } from "@/types/test/TestType";
import { TestResultType } from "@/types/test/TestResultType";

export default function StudentResultClient({ test, testResult }: { test: TestType, testResult: TestResultType }) {
    return (
        <>
            <p>Student Result</p>
            <p>Name - {test.name}</p>
            {
                test.adaptation_id && <p>Adaptation - {test.adaptation_id}</p>
            }
            <ul className="flex flex-col gap-6 m-8">
                { 
                    test.question.map((q) => {
                        const studentResponse = testResult.response.find((r) => r.question_id === q.id);

                        return (
                            <li key={q.id} className="p-8 bg-purple-300 rounded-lg flex flex-col gap-5">
                                <p>Question: {q.question_text}</p>
                                {
                                    q.option.map((o) => {
                                        const optionResponse = testResult.response.find((r) => r.selected_option_id === o.id);

                                        return (
                                            <p key={o.id} className={`
                                                ${o.is_correct ? 'text-blue-800' : ''}
                                            `}>
                                                {o.option_text}
                                                {
                                                    o.id === optionResponse?.selected_option_id &&
                                                    <span className="text-gray-400"> | Your answer</span>
                                                }
                                            </p>
                                        )
                                    })
                                }
                                <p>Result: {studentResponse?.is_correct ? 'Correct' : 'Incorrect'}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <p>Final Mark: {testResult.score}</p>
        </>
    )
}
