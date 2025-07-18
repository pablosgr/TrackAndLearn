import { getTests } from "./actions";
import requireUser from "@/utils/auth/requireUser";
import TestsPageClient from "./TestPageClient";

export default async function TestsPage() {
    const user = await requireUser();
    const tests = await getTests(user?.id);

    return (
        <TestsPageClient data={tests}/>
    )
}
