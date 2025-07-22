import { getTestByTemplateId } from "@/app/(protected)/tests/actions";
import StudentTestClient from "./StudentTestClient";

export default async function StudentTest({ params }: { params: { testId: string } }) {
    const data = await params;
    const test = await getTestByTemplateId(data.testId);

    return (
        <StudentTestClient testDetail={test}/>
    )
}
