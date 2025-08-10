import { TestResultType } from "./TestResultType";
import { StudentType } from "../user/StudentType";

export type ClassroomResultType = TestResultType & {
    student_data: StudentType;
    test_data: {
        name: string;
        level: string;
        time_limit: number;
        adaptation_id: number;
        test_adaptation: {
            name: string;
            code:string;
        }
    }
}
