import CustomAlertDialog from "../CustomAlertDialog";
import { removeStudentFromClassroom } from "@/app/(protected)/classrooms/actions/delete";
import { StudentType } from "@/types/user/StudentType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function StudentCard({
    student,
    classroomId,
    onDelete,
}: {
    student: StudentType,
    classroomId: number,
    onDelete: (removedStudentId: number) => void
}) {
    const handleStudentRemoval = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(student.id);
        await removeStudentFromClassroom(student.id, classroomId);
    }

    return (
        <Card 
            className={`
                w-full flex flex-row my-0
                border-0 border-b-1 border-gray-300
                py-5 rounded-none shadow-none
                hover:cursor-pointer hover:bg-cyan-100/50
            `}
        >
            <CardContent className="w-full flex flex-row justify-between gap-6 items-center">
                <div className="flex flex-row gap-10 items-center">
                    <span>{student.username}</span>
                    <span>{student.name}</span>
                    <span>{student.email}</span>
                </div>
                <CustomAlertDialog 
                    description="Student will be removed from the classroom. This action cannot be undone."
                    onDelete={handleStudentRemoval}
                />
            </CardContent>
        </Card>
    )
}
