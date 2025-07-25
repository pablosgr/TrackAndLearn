import { TestResultType } from "./TestResultType";

export type ClassroomResultType = TestResultType & {
    student_data: {
        name: string;
    }
}
