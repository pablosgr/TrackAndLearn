import { ClassroomResultType } from "@/types/test/ClassroomResultType"

export default function ClassroomResultClient({ classroomResults }: { classroomResults: ClassroomResultType[] }) {
    return (
        <div>
            Classroom result
            <ul className="flex flex-col gap-6">
                {
                    classroomResults.map((res) => (
                        <li key={res.id} className="p-6 rounded-lg bg-green-300">
                            <p>Student: {res.student_data.name}</p>
                            <p>Final score: {res.score}</p>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
