import { deleteTestTemplateById } from "@/app/(protected)/tests/actions/delete";
import { Trash } from "lucide-react";
import TestTemplateType from "@/types/test/TestTemplateType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TestCard({ test, onDelete }: { test: TestTemplateType, onDelete: (id: string) => void }) {

    const handleDelete = async (e: React.MouseEvent) => {
        // e.stopPropagation();
        e.preventDefault();
        onDelete(test.id);
        await deleteTestTemplateById(test.id);
    }

    return (
        <Card className="w-90">
            <CardHeader className="bg-(--color-accent) truncate">
                <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                <CardDescription>Topic: {test.topic_data.name}</CardDescription>
                <CardAction onClick={handleDelete} className="p-2 hover:bg-(--color-destructive) rounded-lg transition-colors">
                    <Trash size={22}/>
                </CardAction>
            </CardHeader>
            <CardContent>
                <span className="block truncate text-sm">
                    Created on {new Date(test.created_at).toLocaleDateString()}
                </span>
            </CardContent>
        </Card>
    )
}
