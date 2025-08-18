import { deleteTestTemplateById } from "@/app/(protected)/tests/actions/delete";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TemplateDialog from "./TemplateDialog";
import CustomAlertDialog from "../CustomAlertDialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TemplateCard({ 
    test,
    topics,
    onDelete,
    onUpdate
}: { 
    test: TestTemplateType,
    topics: TopicType[],
    onDelete: (id: string) => void,
    onUpdate: (updatedTemplate: TestTemplateType) => void
}) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(test.id);
        await deleteTestTemplateById(test.id);
        router.refresh();
    }

    return (
        <Card className="w-90 shadow-(--shadow-xs) hover:shadow-(--shadow-lg) transition-shadow">
            <CardHeader className="h-30 flex flex-row justify-between bg-(--color-accent) truncate">
                <div className="max-w-55 flex flex-col gap-2">
                    <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                    <CardDescription>
                        <Badge className="bg-white/80 text-black font-medium">
                            {test.topic_data.name}
                        </Badge>
                    </CardDescription>
                </div>
                <div className="flex flex-row gap-2">
                    <TemplateDialog
                        type="update"
                        test={test}
                        topics={topics}
                        onUpdate={onUpdate}
                    />
                    <CustomAlertDialog
                        description={`
                            Test template and all related tests will be permanently removed. This action cannot be undone.
                        `}
                        onDelete={handleDelete}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex flex-row justify-between gap-8 items-center">
                <span></span>
                <Link href={`/tests/${test.id}`}>
                    <Button variant={'outline'} className="ml-6 hover:bg-secondary hover:text-white">
                        Go to test
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
