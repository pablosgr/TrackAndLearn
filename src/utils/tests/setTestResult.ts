import { NewTestResponseType } from "@/types/test/TestResponseType";
import { TestResultType } from "@/types/test/TestResultType";

export function setFinalTestResult(
    userResponses: NewTestResponseType[],
    provisionalResult: TestResultType,
    endedAt: string
): TestResultType {
    const totalQuestions = userResponses.length;
    const correctAnswers = userResponses.filter((res) => res.is_correct).length;
    const finalScore = (correctAnswers / totalQuestions) * 10;

    const finalResult = {
        ...provisionalResult,
        score: Number(finalScore.toFixed(2)),
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        status: 'completed',
        ended_at: endedAt
    }
    
    return finalResult;
}
