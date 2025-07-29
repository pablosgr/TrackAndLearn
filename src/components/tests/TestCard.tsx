import { deleteTestTemplateById } from "@/app/(protected)/tests/actions/delete";
import TestTemplateType from "@/types/test/TestTemplateType";
import Link from "next/link";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TestCard({ test, onDelete }: { test: TestTemplateType, onDelete: (id: string) => void }) {

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(test.id);
        await deleteTestTemplateById(test.id);
    }

    return (
        <Card className="w-90">
            <CardHeader className="bg-(--color-accent) truncate">
                <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <CardAction className="p-2 hover:bg-(--color-destructive) hover:cursor-pointer rounded-lg transition-colors">
                            <Trash size={22}/>
                        </CardAction>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Test template and all related tests will be permanently removed. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Topic: {test.topic_data.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row justify-between gap-8 items-center">
                <span className="truncate text-sm">
                    Created on {new Date(test.created_at).toLocaleDateString()}
                </span>
                <Link href={`/tests/${test.id}`}>
                    <Button variant={'outline'} className="ml-6">
                        Go to test
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
