import ClassroomDetailClient from "./ClassroomDetailClient";
import { getClassroomById, getClassroomStudents, getAssignedTests } from "../actions";

export default async function TestsDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const classroom = await getClassroomById(data.id);
    const students = await getClassroomStudents(data.id);
    const tests = await getAssignedTests(data.id);

    return (
        <ClassroomDetailClient 
            studentList={students}
            testList={tests}
            classroomDetails={classroom}
        />
    )
}
