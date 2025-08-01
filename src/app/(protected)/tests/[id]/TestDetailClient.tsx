import { TestType } from "@/types/test/TestType";
import TestTemplateType from "@/types/test/TestTemplateType";
import TestDetailCard from "@/components/tests/TestDetailCard";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger 
} from "@/components/ui/tabs";

export default async function TestDetailClient({ 
    testList,
    testTemplate
}: { 
    testList: TestType[],
    testTemplate: TestTemplateType
}) {

    return (
        <Card className="w-full">
            <CardHeader className="bg-(--color-accent) gap-2 py-6">
                <CardTitle className="text-2xl">{testTemplate.name} | {testTemplate.topic_data.name}</CardTitle>
                <CardDescription>Created on {new Date(testTemplate.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={testList[0].id.toString()}>
                    <TabsList>
                        {
                            testList.map((test) => (
                                <TabsTrigger key={test.id} value={test.id.toString()} className="hover:cursor-pointer">
                                    {test.name}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    {
                        testList.map((test) => (
                            <TabsContent key={test.id} value={test.id.toString()}>
                                <TestDetailCard test={test} />
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </CardContent>
        </Card>
    );
}
