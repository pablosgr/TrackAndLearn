import ClassroomDetailClient from "./ClassroomDetailClient";
import { getClassroomById, getClassroomStudents, getAssignedTests } from "../actions";
import { getAdaptations } from "../../tests/actions/get";
import { getTestTemplatesByUserId } from "../../tests/actions/get";
import requireUser from "@/utils/auth/requireUser";
import { notFound } from "next/navigation";

export default async function ClassroomDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const user = await requireUser();
    const classroom = await getClassroomById(data.id);

    if (!classroom) {
        notFound();
    }

    const students = await getClassroomStudents(data.id);
    const tests = await getAssignedTests(data.id, user?.id);
    const availableTests = await getTestTemplatesByUserId(user?.id);
    const adaptations = await getAdaptations();

    return (
        <ClassroomDetailClient
            classroomDetails={classroom}
            studentList={students}
            testList={tests}
            adaptationList={adaptations}
            availableTests={availableTests}
        />
    )
}
