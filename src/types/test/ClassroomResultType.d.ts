import { TestResultType } from "./TestResultType";
import { StudentType } from "../user/StudentType";
import { QuestionType } from "./QuestionType";

export type ClassroomResultType = TestResultType & {
    student_data: StudentType;
    test_data: {
        name: string;
        level: string;
        time_limit: number;
        adaptation_id: number;
        question: QuestionType[];
        test_adaptation: {
            name: string;
            code:string;
        };
    }
}
