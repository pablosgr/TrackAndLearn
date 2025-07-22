import { getTestByTemplateId } from "../actions";
import TestDetailClient from "./TestDetailClient";

export default async function TestsDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const tests = await getTestByTemplateId(data.id);

    return (
        <TestDetailClient test={tests[0]}/>
    )
}
