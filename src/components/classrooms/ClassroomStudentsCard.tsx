import StudentCard from "./StudentCard";
import { StudentType } from "@/types/user/StudentType";

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
        <>
            {
                studentList.map((student) => (
                    <StudentCard 
                        key={student.id}
                        student={student}
                        classroomId={classroomId}
                        onDelete={onDelete} />
                ))
            }
        </>
    )
}
