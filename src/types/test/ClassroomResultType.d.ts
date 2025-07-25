import { TestResultType } from "./TestResultType";
import { StudentType } from "../user/StudentType";

export type ClassroomResultType = TestResultType & {
    student_data: StudentType;
}
