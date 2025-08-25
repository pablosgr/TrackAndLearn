import ClassroomDetailClient from "./ClassroomDetailClient";
import { redirect } from "next/navigation";
import { 
    getClassroomById,
    getClassroomStudents,
    getAssignedTests,
    verifyClassroomEnrollment,
    verifyClassroomOwnership
} from "../actions";
import { getAdaptations } from "../../tests/actions/get";
import { getTestTemplatesByUserId } from "../../tests/actions/get";
import requireUser from "@/utils/auth/requireUser";
import { notFound } from "next/navigation";

export default async function ClassroomDetail({ params }: { params: { id: string } }) {
    const { id } = params;
    const user = await requireUser();
    const classroom = await getClassroomById(id);

    if (!classroom) {
        notFound();
    }

    const isEnrolled = await verifyClassroomEnrollment(user?.id, Number(id));
    if (user?.role === "student" && !isEnrolled) {
        redirect("/unauthorized");
    }

    const isOwner = await verifyClassroomOwnership(user?.id, Number(id));
    if (user?.role === "teacher" && !isOwner) {
        redirect("/unauthorized");
    }

    const students = await getClassroomStudents(id);
    const tests = await getAssignedTests(id, user?.id);
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
