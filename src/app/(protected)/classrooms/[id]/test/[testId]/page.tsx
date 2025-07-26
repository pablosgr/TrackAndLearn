import { getTestsByTemplateId } from "@/app/(protected)/tests/actions";
import isTestCompleted from "../../../actions";
import StudentTestClient from "./StudentTestClient";
import { notFound } from "next/navigation";
import requireUser from "@/utils/auth/requireUser";

export default async function StudentTest({ params }: { params: { id: string, testId: string } }) {
    const data = await params;
    const user = await requireUser();
    const tests = await getTestsByTemplateId(data.testId);

    const visibleTest = tests.find(t => t.adaptation_id === user?.adaptation_id) ?? tests[0];

    if (!visibleTest) {
        return notFound();
    }

    const completedTest = await isTestCompleted(user?.id, data.id, visibleTest.id);

    if (completedTest) {
        return <p>Test already done</p>
    }

    return (
        <StudentTestClient test={visibleTest}/>
    )
}
