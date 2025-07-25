import { TestResponseType } from "./TestResponseType";

export type TestResultType = {
    id: number;
    student_id: number;
    classroom_id: number;
    test_id: number;
    score: number;
    total_questions: number;
    correct_answers: number;
    status: 'completed' | 'in_progress' | 'not_started' | string;
    started_at: string;
    ended_at: string;
    response: TestResponseType[];
};
