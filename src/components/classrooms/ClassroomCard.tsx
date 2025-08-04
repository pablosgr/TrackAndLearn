import { ClassroomType } from "@/types/classroom/ClassroomType";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userWrapper";
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

export default function ClassroomCard({ 
    classroom,
    // onDelete,
    // onUpdate
}: { 
    classroom: ClassroomType,
    // onDelete: (id: string) => void,
    // onUpdate: () => void
}) {
    const user = useUser();
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        // onDelete(classroom.id);
        // await deleteClassroomById(classroom.id);
        // router.refresh();
    }

    return (
        <Card className="w-90 shadow-(--shadow-xs) hover:shadow-(--shadow-lg) transition-shadow">
            <CardHeader className="h-30 flex flex-row justify-between bg-(--color-secondary) truncate">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg truncate">{classroom.name}</CardTitle>
                    {
                        user.role === 'student' &&
                        <CardDescription>Teacher: {classroom.teacher?.name}</CardDescription>
                    }
                </div>
                <div className="flex flex-row gap-2">
                    {/* <ClassroomDialog
                        type="update"
                        onUpdate={onUpdate}
                    /> */}
                    {
                        user.role === 'teacher' &&
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
                                        Classroom and all related assignments/results will be permanently removed. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    }
                </div>
            </CardHeader>
            <CardContent className="w-full flex flex-row gap-8 justify-end">
                <Link href={`/classrooms/${classroom.id}`}>
                    <Button variant={'outline'}>
                        Go to classroom
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
