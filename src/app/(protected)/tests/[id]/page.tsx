import { getTestByTemplateId } from "../actions";
import requireUser from "@/utils/auth/requireUser";
import TestDetailClient from "./TestDetailClient";
import { notFound } from "next/navigation";

export default async function TestsDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const userData = await requireUser();
    const tests = await getTestByTemplateId(data.id);

    if (!tests[0]) {
        notFound();
    }

    const isAuthor = userData?.id === tests[0].test_template?.teacher_id;

    if (!isAuthor) {
        return (
            <p>You are not the author of this test</p>
        )
    }

    return (
        <TestDetailClient test={tests[0]}/>
    )
}
