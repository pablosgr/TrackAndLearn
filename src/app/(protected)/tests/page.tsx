import { getTestTemplatesByUserId, getTopics } from "./actions/get";
import requireUser from "@/utils/auth/requireUser";
import TestsPageClient from "./TestsPageClient";

export default async function TestsPage() {
    const user = await requireUser();
    const tests = await getTestTemplatesByUserId(user?.id);
    const topics = await getTopics();

    return (
        <TestsPageClient testList={tests} topicList={topics}/>
    )
}
