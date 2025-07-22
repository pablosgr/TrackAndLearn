'use client'

import { useState } from "react";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { StudentType } from "@/types/user/StudentType";
import { AssignedTestType } from "@/types/test/AssignedTestType";

export default function ClassroomDetailClient(
{ 
    classroomDetails,
    studentList,
    testList 
}: {
    classroomDetails: ClassroomType | null,
    studentList: StudentType[],
    testList: AssignedTestType[]
}) {
    const [classroom, setClassroom] = useState<ClassroomType | null>(classroomDetails);
    const [students, setStudents] = useState<StudentType[]>(studentList);
    const [tests, setTests] = useState<AssignedTestType[]>(testList);

    if (!classroom) {
        return <div>Classroom not found</div>
    }

    return (
        <div className="flex flex-col gap-8 p-10 m-5 rounded-lg bg-cyan-300 shadow-md">
            <h2 className="font-bold">{classroom.name}</h2>
            <p>Teacher: {classroom.teacher?.name}</p>
            <section className="bg-cyan-100 p-5 rounded-lg">
                <h2 className="font-semibold">Student List</h2>
                <ul>
                    {
                        students && students.map((item) => (
                            <li key={item.id}>{item.username}</li>
                        ))
                    }
                </ul>
            </section>
            <section className="bg-cyan-100 p-5 rounded-lg">
                <h2 className="font-semibold">Assigned Tests</h2>
                <ul>
                    {
                        tests && tests.map((item) => (
                            <li key={item.id}>{item.test_template.name}</li>
                        ))
                    }
                </ul>
            </section>
        </div>
    )
}
