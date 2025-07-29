import { getTestTemplatesByUserId } from "./actions/get";
import requireUser from "@/utils/auth/requireUser";
import TestsPageClient from "./TestsPageClient";

export default async function TestsPage() {
    const user = await requireUser();
    const tests = await getTestTemplatesByUserId(user?.id);

    return (
        <TestsPageClient data={tests}/>
    )
}
