'use client'

import { useState } from "react";
import { useUser } from "@/components/context/userWrapper";
import ClassroomStudentsCard from "@/components/classrooms/ClassroomStudentsCard";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { StudentType } from "@/types/user/StudentType";
import { AssignedTestType } from "@/types/test/AssignedTestType";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger 
} from "@/components/ui/tabs";

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
    const [selectedTab, setSelectedTab] = useState('tests');
    const user = useUser();

    const handleStudentDelete = (removedStudentId: number) => {
        setStudents(prev => prev.filter(student => student.id !== removedStudentId));
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="bg-(--color-secondary) gap-2 py-6">
                <CardTitle className="text-2xl">{classroom.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2">
                    <span>Teacher: {classroom.teacher?.name}</span>
                    <span>Created on {new Date(classroom.created_at).toLocaleDateString()}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <div className="h-full flex flex-row gap-5">
                    <section className="w-60 h-full">
                        <Card className="flex flex-col gap-0 shadow-none border-gray-300 rounded-lg">
                            <CardHeader>
                                <CardTitle>Classroom code</CardTitle>
                            </CardHeader>
                            <CardContent className="w-full">
                                <span className="text-2xl text-accent text-shadow-2xs">
                                    {classroom.code}
                                </span>
                            </CardContent>
                        </Card>
                    </section>
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                        <TabsList>
                            <TabsTrigger value="tests" className="hover:cursor-pointer">
                                Assignments
                            </TabsTrigger>
                            <TabsTrigger value="students" className="hover:cursor-pointer">
                                Students
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tests">
                            You're in tests now
                        </TabsContent>
                        <TabsContent value="students" className="w-full h-full">
                            <ClassroomStudentsCard 
                                studentList={students}
                                classroomId={classroom.id}
                                onDelete={handleStudentDelete}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
        // <div className="flex flex-col gap-8 p-10 m-5 rounded-lg bg-cyan-300 shadow-md">
        //     <h2 className="font-bold">{classroom.name}</h2>
        //     <p>Teacher: {classroom.teacher?.name}</p>
        //     <p>Classroom code: {classroom.code}</p>
        //     <section className="bg-cyan-100 p-5 rounded-lg">
        //         <h2 className="font-semibold">Assigned Tests</h2>
        //         <ul className="flex flex-col gap-3">
        //             {
        //                 tests && tests.map((item) => (
        //                     <li key={item.id} className="flex flex-row gap-3 items-center">
        //                         {
        //                             user.role === 'teacher' && (
        //                                 <Link href={`/classrooms/${classroom.id}/test/${item.test_template_id}/result`}>
        //                                     <button className="p-2 rounded-lg bg-orange-300 hover:cursor-pointer">
        //                                         View results
        //                                     </button>
        //                                 </Link>
        //                             )
        //                         }
        //                         {
        //                             user.role === 'student' && (
        //                                 item.has_result
        //                                 ? item.is_result_visible && 
        //                                     <Link href={`/classrooms/${classroom.id}/test/${item.test_template_id}/result`}>
        //                                         <button className="p-2 rounded-lg bg-orange-300 hover:cursor-pointer">
        //                                             View result
        //                                         </button>
        //                                     </Link>
        //                                 : <Link href={`/classrooms/${classroom.id}/test/${item.test_template_id}`}>
        //                                         <button className="p-2 rounded-lg bg-orange-300 hover:cursor-pointer">
        //                                             Take test
        //                                         </button>
        //                                     </Link>
        //                             )
        //                         }
        //                         <p className={`${item.has_result && 'text-gray-400'}`}>{item.test_template.name}</p>
        //                     </li>
        //                 ))
        //             }
        //         </ul>
        //     </section>
        // </div>
    )
}
