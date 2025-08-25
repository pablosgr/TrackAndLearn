import { getTestsById } from "@/app/(protected)/tests/actions/get";
import { getStudentAdaptationId } from "../../../actions/get";
import getResult from "../../../actions";
import StudentTestClient from "./StudentTestClient";
import { notFound } from "next/navigation";
import requireUser from "@/utils/auth/requireUser";

export default async function StudentTest({ params }: { params: { id: string, testId: string } }) {
    const { id, testId } = params;
    const user = await requireUser();
    const tests = await getTestsById(testId, 'template');
    const adaptationId = await getStudentAdaptationId(id, user.id);

    const visibleTest = tests.find(t => t.adaptation_id === adaptationId) ?? tests[0];

    if (!visibleTest) {
        notFound();
    }

    const result = await getResult(user?.id, id, visibleTest.id);

    if (result?.status === 'completed') {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <p className="text-2xl">Test already done</p>
            </div>
        )
    }

    return (
        <StudentTestClient 
            test={visibleTest}
            classroomId={id}
            result={result}
        />
    )
}
