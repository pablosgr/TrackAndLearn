import StudentResultClient from "./StudentResultClient";
import ClassroomResultClient from "./ClassroomResultClient";
import requireUser from "@/utils/auth/requireUser";
import { getTestsByTemplateId } from "@/app/(protected)/tests/actions";
import { getStudentTestResult, getClassroomTestResults } from "@/app/(protected)/classrooms/actions";
import { notFound } from "next/navigation";

export default async function StudentResult({ params }: { params: { id: string, testId: string } }) {
    const data = await params;
    const user = await requireUser();
    const tests = await getTestsByTemplateId(data.testId);

    if (user?.role === 'teacher') {
        const classroomResults = await getClassroomTestResults(data.id, data.testId);
        
        return <ClassroomResultClient classroomResults={classroomResults} />
    }
    
    const completedTest = tests.find(t => t.adaptation_id === user?.adaptation_id) ?? tests[0];
    
    if (!completedTest) {
        return <div>Could not find test</div>
    }

    const testResult = await getStudentTestResult(completedTest.id, user?.id, data.id);

    if (!testResult) {
        notFound();
    }

    return (
        <StudentResultClient test={completedTest} testResult={testResult}/>
    )
}
