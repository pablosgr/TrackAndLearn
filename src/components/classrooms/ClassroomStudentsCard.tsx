import StudentCard from "./StudentCard";
import { StudentType } from "@/types/user/StudentType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { Card } from "../ui/card";

export default function ClassroomStudentsCard({ 
    studentList,
    adaptationList,
    classroomId,
    onDelete,
    onUpdate
}: { 
    studentList: StudentType[],
    adaptationList: AdaptationType[],
    classroomId: number,
    onDelete: (removedStudentId: number) => void,
    onUpdate: (student_id: number, adaptationId: number | null) => void
}) {
    const students = studentList.length > 0;

    return (
        <Card
            className={`
                flex pt-3
                ${!students && 'min-h-70 flex-col gap-2 items-center justify-center'}
                shadow-none border-none rounded-none
            `}>
            {
                !students &&
                <div className="flex flex-col gap-3 items-center justify-center text-gray-400 dark:text-white/60">
                    <span className="text-lg">
                        No students enrolled yet..
                    </span>
                    <span className="text-md">
                        Share the Classroom code to let them join!
                    </span>
                </div>
            }
            {
                students && (
                    <ul className="flex flex-col gap-0">
                        {
                            studentList.map((student) => (
                                <li key={student.id}>
                                    <StudentCard
                                        student={student}
                                        adaptationList={adaptationList}
                                        classroomId={classroomId}
                                        onDelete={onDelete}
                                        onUpdate={onUpdate}
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
