import { getTestsById } from "@/app/(protected)/tests/actions/get";
import { getStudentIdAdaptation } from "@/app/(protected)/classrooms/actions/get";
import getResult from "../../../actions";
import StudentTestClient from "./StudentTestClient";
import { notFound } from "next/navigation";
import requireUser from "@/utils/auth/requireUser";

export default async function StudentTest({ params }: { params: { id: string, testId: string } }) {
    const data = await params;
    const user = await requireUser();
    const tests = await getTestsById(data.testId, 'template');
    const adaptationId = await getStudentIdAdaptation(data.id, user.id);

    const visibleTest = tests.find(t => t.adaptation_id === adaptationId) ?? tests[0];

    if (!visibleTest) {
        notFound();
    }

    const result = await getResult(user?.id, data.id, visibleTest.id);

    if (result?.status === 'completed') {
        return <p>Test already done</p>
    }

    return (
        <StudentTestClient 
            test={visibleTest}
            classroomId={data.id}
            result={result}
        />
    )
}
