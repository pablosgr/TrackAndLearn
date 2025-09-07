import { getTestTemplatesByUserId, getTopics, getAdaptations } from "./actions/get";
import requireUser from "@/utils/auth/requireUser";
import TestsPageClient from "./TestsPageClient";

export default async function TestsPage() {
    const user = await requireUser();
    const tests = await getTestTemplatesByUserId(user?.id, [0, 7]);
    const topics = await getTopics();
    const adaptations = await getAdaptations();

    return (
        <TestsPageClient
            testList={tests}
            topicList={topics}
            adaptationList={adaptations}
        />
    )
}
