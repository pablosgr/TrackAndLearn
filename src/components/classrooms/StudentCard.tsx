import CustomAlertDialog from "../CustomAlertDialog";
import { useRouter } from "next/navigation";
import { removeStudentFromClassroom } from "@/app/(protected)/classrooms/actions/delete";
import { updateStudentAdaptation } from "@/app/(protected)/classrooms/actions/update";
import { StudentType } from "@/types/user/StudentType";
import { AdaptationType } from "@/types/test/AdaptationType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function StudentCard({
    student,
    adaptationList,
    classroomId,
    onDelete,
    onUpdate
}: {
    student: StudentType,
    adaptationList: AdaptationType[],
    classroomId: number,
    onDelete: (removedStudentId: number) => void,
    onUpdate: (student_id: number, adaptationId: number | null) => void
}) {
    const router = useRouter();

    const handleStudentRemoval = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(student.id);
        await removeStudentFromClassroom(student.id, classroomId);
        router.refresh();
    }

    const handleAdaptationUpdate = async (value: string) => {
        const adaptationId = value === 'none' ? null : Number(value);
        onUpdate(student.id, adaptationId);
        await updateStudentAdaptation(adaptationId, classroomId, student.id);
        router.refresh();
    }

    return (
        <Card 
            className={`
                w-full flex flex-row my-0
                border-0 border-b-1 border-gray-300
                py-5 rounded-none shadow-none
                hover:cursor-pointer hover:bg-secondary/20
                dark:hover:bg-primary/20 transition-colors
            `}
        >
            <CardContent className="w-full flex flex-row flex-wrap justify-between gap-6 items-center text-sm">
                <div className="flex flex-row gap-10 items-center self-center">
                    <span>{student.name}</span>
                    <span>{student.username}</span>
                    <span>{student.email}</span>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <p>Adaptation</p>
                    <Select
                        value={student.adaptation_id !== null ? student.adaptation_id.toString() : 'none'} 
                        onValueChange={handleAdaptationUpdate}
                    >
                        <SelectTrigger className="w-30 hover:cursor-pointer">
                            <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="none">None</SelectItem>
                                {
                                    adaptationList.map((adp) => (
                                        <SelectItem key={adp.id} value={adp.id.toString()}>
                                            {adp.code}
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <CustomAlertDialog 
                        description="Student and related results will be removed from the classroom. This action cannot be undone."
                        onDelete={handleStudentRemoval}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
