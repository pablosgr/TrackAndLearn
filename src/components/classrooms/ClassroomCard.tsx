import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { deleteClassroomById } from "@/app/(protected)/classrooms/actions/delete";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { Button } from "../ui/button";
import CustomAlertDialog from "../CustomAlertDialog";
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
    onDelete,
}: { 
    classroom: ClassroomType,
    onDelete: (classroomId: number) => void,
}) {
    const user = useUser();
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(classroom.id);
        await deleteClassroomById(classroom.id);
        router.refresh();
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
                    {
                        user.role === 'teacher' &&
                        <CustomAlertDialog
                            description={`
                                Classroom and all related assignments/results will be permanently removed. 
                                This action cannot be undone.
                            `}
                            onDelete={handleDelete}
                        />
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
