import StudentCard from "./StudentCard";
import { StudentType } from "@/types/user/StudentType";

export default function ClassroomStudentsCard({ 
    studentList,
    onDelete,
}: { 
    studentList: StudentType[],
    onDelete: (removedStudent: StudentType) => void,
}) {
    return (
        <>
            {
                studentList.map((student) => (
                    <StudentCard key={student.id} student={student} onDelete={onDelete} />
                ))
            }
        </>
    )
}
