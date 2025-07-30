import { TestType } from "@/types/test/TestType";
import TestTemplateType from "@/types/test/TestTemplateType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function TestDetailClient({ 
    testList,
    testTemplate
}: { 
    testList: TestType[],
    testTemplate: TestTemplateType
}) {

    return (
        <Card>
            <CardHeader className="bg-(--color-accent)">
                <CardTitle className="text-2xl">{testTemplate.name} | {testTemplate.topic_data.name}</CardTitle>
                <CardDescription>Created on {new Date(testTemplate.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
        </Card>
    );
}
