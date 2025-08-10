'use client'

import { useState } from "react";
import { useUser } from "@/components/context/userWrapper";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import ClassroomStudentsCard from "@/components/classrooms/ClassroomStudentsCard";
import ClassroomAssignmentsCard from "@/components/classrooms/ClassroomAssignmentsCard";
import ClassroomDialog from "@/components/classrooms/ClassroomDialog";
import { resetClassCode } from "../actions/update";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { StudentType } from "@/types/user/StudentType";
import { AdaptationType } from "@/types/test/AdaptationType";
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
    testList,
    adaptationList,
    availableTests
}: {
    classroomDetails: ClassroomType,
    studentList: StudentType[],
    testList: AssignedTestType[],
    adaptationList: AdaptationType[],
    availableTests: TestTemplateType[]
}) {
    const [classroom, setClassroom] = useState<ClassroomType>(classroomDetails);
    const [students, setStudents] = useState<StudentType[]>(studentList);
    const [assignedTests, setAssignedTests] = useState<AssignedTestType[]>(testList);
    const [selectedTab, setSelectedTab] = useState<string>('tests');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const user = useUser();

    const handleStudentDelete = (removedStudentId: number) => {
        setStudents(prev => prev.filter(student => student.id !== removedStudentId));
    }

    const handleAdaptationUpdate = (studentId: number, adaptationId: number | null) => {
        if (!adaptationId) {
            setStudents(prev => prev.map((student) => 
                student.id === studentId
                ? {
                    ...student,
                    adaptation_id: null,
                    adaptation_data: null
                }
                : student
            ))
        }
        
        const selectedAdaptation = adaptationList.find((adp) => adp.id === Number(adaptationId));

        if (!selectedAdaptation) {
            return;
        }

        setStudents(prev => prev.map((student) => 
            student.id === Number(studentId)
            ? {
                ...student,
                adaptation_id: selectedAdaptation.id,
                adaptation_data: {
                    name: selectedAdaptation.name,
                    code: selectedAdaptation.code
                }
            }
            : student
        ))
    }

    const handleAssignTest = (newAssignment: AssignedTestType) => {
        setAssignedTests(prev => [newAssignment, ...prev]);
    }

    const handleRemoveAssignment = (assignmentId: number) => {
        setAssignedTests(prev => prev.filter((test) => test.id !== assignmentId));
    }

    const handleCodeReset = async () => {
        setIsGenerating(true);

        const newCode = await resetClassCode(classroom.id);

        if (newCode) {
            setClassroom(prev => ({
                ...prev,
                code: newCode
            }));
        }

        setIsGenerating(false);
    }

    const handleUpdateName = (updatedName: string) => {
        setClassroom(prev => ({
            ...prev,
            name: updatedName
        }));
    }

    const handleResultVisibility = (assignmentId: number, visible: boolean) => {
        setAssignedTests(prev => 
            prev.map((test) => 
                test.id === assignmentId
                ? {
                    ...test,
                    is_result_visible: visible
                }
                : test
            )
        );
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="bg-(--color-secondary) gap-2 py-6">
                <CardTitle className="text-2xl">{classroom.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2">
                    <span>Teacher: {classroom.teacher?.name}</span>
                    <span>Created on {new Date(classroom.created_at).toLocaleDateString()}</span>
                </CardDescription>
                {
                    user.role === 'teacher' &&
                    <ClassroomDialog 
                        type="update"
                        classroom={classroom}
                        onUpdate={handleUpdateName}
                    />
                }
            </CardHeader>
            <CardContent className="h-full w-full">
                <div className="h-full flex flex-row gap-5">
                    {
                        user.role === 'teacher' &&
                        <section className="min-w-48 h-full">
                            <Card className="flex flex-col gap-0 shadow-none border-gray-300 rounded-lg">
                                <CardHeader>
                                    <CardTitle>Classroom code</CardTitle>
                                </CardHeader>
                                <CardContent className="w-full flex flex-col gap-3">
                                    <span className="text-2xl text-accent text-shadow-2xs">
                                        {classroom.code}
                                    </span>
                                    <Button variant="outline" disabled={isGenerating} onClick={handleCodeReset}>
                                        {
                                            isGenerating ? (
                                                <>
                                                    <LoaderCircle size={22} className="animate-spin mr-1" />
                                                    Generating
                                                </>
                                            ) : (
                                                'Reset code'
                                            )
                                        }
                                    </Button>
                                </CardContent>
                            </Card>
                        </section>
                    }
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full h-full">
                        <TabsList>
                            <TabsTrigger value="tests" className="hover:cursor-pointer">
                                Assignments
                            </TabsTrigger>
                            {
                                user.role === 'teacher' &&
                                <TabsTrigger value="students" className="hover:cursor-pointer">
                                    Students
                                </TabsTrigger>
                            }
                        </TabsList>
                        <TabsContent value="tests">
                            <ClassroomAssignmentsCard
                                assignedTests={assignedTests}
                                availableTests={availableTests}
                                classroomId={classroomDetails.id}
                                onAssign={handleAssignTest}
                                onDelete={handleRemoveAssignment}
                                onResult={handleResultVisibility}
                            />
                        </TabsContent>
                        {
                            user.role === 'teacher' &&
                            <TabsContent value="students">
                                <ClassroomStudentsCard 
                                    studentList={students}
                                    adaptationList={adaptationList}
                                    classroomId={classroom.id}
                                    onDelete={handleStudentDelete}
                                    onUpdate={handleAdaptationUpdate}
                                />
                            </TabsContent>
                        }
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}
