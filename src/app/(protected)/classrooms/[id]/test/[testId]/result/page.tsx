import StudentResultClient from "./StudentResultClient";
import ClassroomResultClient from "./ClassroomResultClient";
import requireUser from "@/utils/auth/requireUser";
import { getTestsById } from "@/app/(protected)/tests/actions/get";
import { getStudentAdaptationId } from "@/app/(protected)/classrooms/actions/get";
import { getStudentTestResult, getClassroomTestResults } from "@/app/(protected)/classrooms/actions";
import { notFound } from "next/navigation";

export default async function StudentResult({ params }: { params: Promise<{ id: string, testId: string }> }) {
    const { id, testId } = await params;
    const user = await requireUser();

    if (user?.role === 'teacher') {
        const classroomResults = await getClassroomTestResults(id, testId);
        
        return <ClassroomResultClient classroomResults={classroomResults} />
    }

    const tests = await getTestsById(testId, 'template');
    const adaptationId = await getStudentAdaptationId(id, user.id);
    
    const completedTest = tests.find(t => t.adaptation_id === adaptationId) ?? tests[0];
    
    if (!completedTest) {
        notFound();
    }

    const testResult = await getStudentTestResult(completedTest.id, testId, user?.id, id);

    if (!testResult) {
        notFound();
    }

    return (
        <StudentResultClient test={completedTest} testResult={testResult}/>
    )
}
