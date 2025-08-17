import { getTestsById, getTestTemplate, getAdaptations } from "../actions/get";
import requireUser from "@/utils/auth/requireUser";
import TestDetailClient from "./TestDetailClient";
import { notFound, redirect } from "next/navigation";

export default async function TestsDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const userData = await requireUser();
    const tests = await getTestsById(data.id, 'template');
    const testTemplate = await getTestTemplate(data.id);
    const adaptations = await getAdaptations();

    if (!testTemplate) {
        notFound();
    }

    if (tests.length === 0) {
        notFound();
    }

    const isAuthor = Number(userData?.id) === tests[0].test_template?.teacher_id;

    if (!isAuthor) {
        redirect('/unauthorized');
    }

    return (
        <TestDetailClient
            adaptationList={adaptations}
            testList={tests}
            testTemplate={testTemplate}
        />
    )
}
