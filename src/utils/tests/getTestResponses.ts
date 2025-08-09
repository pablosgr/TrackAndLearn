import { TestType } from "@/types/test/TestType";
import { NewTestResponseType } from "@/types/test/TestResponseType";

export function getTestResponses(
    answers: Record<string, string>,
    test: TestType,
    provisionalResultId: number
): NewTestResponseType[] {
    const userAnswers = test.question.map((q) => {
        const userSelectedOption = Number(answers[q.id]);

        const selectedOption = q.option.find((o) => o.id === userSelectedOption);

        const isCorrect = selectedOption?.is_correct ? true : false;

        return {
            test_result_id: provisionalResultId,
            question_id: q.id,
            selected_option_id: selectedOption?.id,
            is_correct: isCorrect
        }
    })

    return userAnswers as NewTestResponseType[];
}
