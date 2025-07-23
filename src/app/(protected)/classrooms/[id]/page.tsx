import ClassroomDetailClient from "./ClassroomDetailClient";
import { getClassroomById, getClassroomStudents, getAssignedTests, verifyEnrollment } from "../actions";
import { notFound } from "next/navigation";

export default async function ClassroomDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const classroom = await getClassroomById(data.id);
    const students = await getClassroomStudents(data.id);
    const tests = await getAssignedTests(data.id);

    if (!classroom) {
        notFound();
    }

    return (
        <ClassroomDetailClient 
            studentList={students}
            testList={tests}
            classroomDetails={classroom}
        />
    )
}
