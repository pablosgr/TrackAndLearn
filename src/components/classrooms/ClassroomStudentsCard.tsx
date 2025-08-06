import StudentCard from "./StudentCard";
import { StudentType } from "@/types/user/StudentType";
import { Card } from "../ui/card";

export default function ClassroomStudentsCard({ 
    studentList,
    classroomId,
    onDelete,
}: { 
    studentList: StudentType[],
    classroomId: number,
    onDelete: (removedStudentId: number) => void,
}) {
    return (
        <Card className="flex flex-col gap-0 p-6 shadow-none border-none rounded-none">
            {
                studentList.map((student) => (
                    <StudentCard 
                        key={student.id}
                        student={student}
                        classroomId={classroomId}
                        onDelete={onDelete} />
                ))
            }
        </Card>
    )
}
