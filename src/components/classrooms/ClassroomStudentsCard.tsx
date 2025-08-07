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
    const students = studentList.length > 0;

    return (
        <Card
            className={`
                flex p-6
                ${students ? '' : 'flex-col gap-2 h-full items-center justify-center'}
                shadow-none border-none rounded-none
            `}>
            {
                !students &&
                <>
                    <span className="text-gray-400 text-lg">
                        No students enrolled yet..
                    </span>
                    <span className="text-gray-400 text-md">
                        Share the Classroom code with them to let them join!
                    </span>
                </>
            }
            {
                students && (
                    <ul className="flex flex-col gap-0">
                        {
                            studentList.map((student) => (
                                <li key={student.id}>
                                    <StudentCard 
                                        student={student}
                                        classroomId={classroomId}
                                        onDelete={onDelete}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </Card>
    )
}
