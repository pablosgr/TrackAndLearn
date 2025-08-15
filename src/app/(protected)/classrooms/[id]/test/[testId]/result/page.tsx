import StudentResultClient from "./StudentResultClient";
import ClassroomResultClient from "./ClassroomResultClient";
import requireUser from "@/utils/auth/requireUser";
import { getTestsById } from "@/app/(protected)/tests/actions/get";
import { getStudentIdAdaptation } from "@/app/(protected)/classrooms/actions/get";
import { getStudentTestResult, getClassroomTestResults } from "@/app/(protected)/classrooms/actions";
import { notFound } from "next/navigation";

export default async function StudentResult({ params }: { params: { id: string, testId: string } }) {
    const data = await params;
    const user = await requireUser();

    if (user?.role === 'teacher') {
        const classroomResults = await getClassroomTestResults(data.id, data.testId);
        
        return <ClassroomResultClient classroomResults={classroomResults} />
    }

    const tests = await getTestsById(data.testId, 'template');
    const adaptationId = await getStudentIdAdaptation(data.id, user.id);
    
    const completedTest = tests.find(t => t.adaptation_id === adaptationId) ?? tests[0];
    
    if (!completedTest) {
        return <div>Could not find test</div>
    }

    const testResult = await getStudentTestResult(completedTest.id, data.testId, user?.id, data.id);

    if (!testResult) {
        notFound();
    }

    return (
        <StudentResultClient test={completedTest} testResult={testResult}/>
    )
}
