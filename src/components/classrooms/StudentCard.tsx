import CustomAlertDialog from "../CustomAlertDialog";
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
    onDelete,
}: {
    student: StudentType,
    onDelete: (removedStudent: StudentType) => void
}) {
    const handleStudentRemoval = (e: React.MouseEvent) => {
        
    }

    return (
        <Card 
            className={`
                w-full flex flex-row my-0
                border-0 border-t-1 border-gray-300
                py-5 rounded-none shadow-none
                hover:cursor-pointer hover:bg-gray-100
            `}
        >
            <CardContent className="w-full flex flex-row justify-between gap-6 items-center">
                <div className="flex flex-row gap-10 items-center">
                    <span>{student.username}</span>
                    <span>{student.name}</span>
                </div>
                <CustomAlertDialog 
                    description="Student will be removed from the classroom. This action cannot be undone."
                    onDelete={handleStudentRemoval}
                />
            </CardContent>
        </Card>
    )
}
