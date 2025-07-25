'use client'

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/userWrapper";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { StudentType } from "@/types/user/StudentType";
import { AssignedTestType } from "@/types/test/AssignedTestType";

export default function ClassroomDetailClient(
{ 
    classroomDetails,
    studentList,
    testList 
}: {
    classroomDetails: ClassroomType,
    studentList: StudentType[],
    testList: AssignedTestType[]
}) {
    const [classroom, setClassroom] = useState<ClassroomType>(classroomDetails);
    const [students, setStudents] = useState<StudentType[]>(studentList);
    const [tests, setTests] = useState<AssignedTestType[]>(testList);
    const user = useUser();

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
                <ul className="flex flex-col gap-3">
                    {
                        tests && tests.map((item) => (
                            <li key={item.id} className="flex flex-row gap-3 items-center">
                                {
                                    user.role === 'teacher' && (
                                        <Link href={`/classrooms/${classroom.id}/test/${item.test_template_id}/result`}>
                                            <button className="p-2 rounded-lg bg-orange-300 hover:cursor-pointer">
                                                View results
                                            </button>
                                        </Link>
                                    )
                                }
                                {
                                    user.role === 'student' && (
                                        item.has_result
                                        ? item.is_result_visible && 
                                            <Link href={`/classrooms/${classroom.id}/test/${item.test_template_id}/result`}>
                                                <button className="p-2 rounded-lg bg-orange-300 hover:cursor-pointer">
                                                    View result
                                                </button>
                                            </Link>
                                        : <Link href={`/classrooms/${classroom.id}/test/${item.test_template_id}`}>
                                                <button className="p-2 rounded-lg bg-orange-300 hover:cursor-pointer">
                                                    Take test
                                                </button>
                                            </Link>
                                    )
                                }
                                <p className={`${item.has_result && 'text-gray-400'}`}>{item.test_template.name}</p>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </div>
    )
}
