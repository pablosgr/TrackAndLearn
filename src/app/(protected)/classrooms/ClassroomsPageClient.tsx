'use client'

import { ClassroomType } from "@/types/classroom/ClassroomType";
import { useState } from "react";
import { useUser } from "@/components/context/userWrapper";
import ClassroomDialog from "@/components/classrooms/ClassroomDialog";
import JoinClassroomDialog from "@/components/classrooms/JoinClassroomDialog";
import ClassroomCard from "@/components/classrooms/ClassroomCard";

export default function ClassroomsPageClient({ data }: { data: ClassroomType[] }) {
    const user = useUser();
    const [classrooms, setClassrooms] = useState<ClassroomType[]>(data);
    const hasClassrooms = classrooms.length > 0;

    const handleCreateClassroom = (newClassroom: ClassroomType) => {
        setClassrooms(prev => [newClassroom, ...prev]);
    }

    const handleDeleteClassroom = (classroomId: number) => {
        setClassrooms(prev => prev.filter((item) => item.id !== classroomId));
    }
    
    return (
        <>
            <header className="w-full flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl font-bold">My Classrooms</h1>
                {
                    user.role === 'teacher'
                    ? hasClassrooms && <ClassroomDialog
                            type="create"
                            onCreate={handleCreateClassroom}
                        />
                    : hasClassrooms && <JoinClassroomDialog 
                        version="default"
                            onJoin={handleCreateClassroom}
                        />
                }
            </header>
            <section className={`w-full flex flex-col @container ${!hasClassrooms && 'h-full items-center'}`}>
                {
                    !hasClassrooms
                    ? <div className="h-full flex flex-col justify-center gap-3">
                        <span className="text-lg">
                            {
                                user.role === 'teacher'
                                ? 'Start creating a Classroom!'
                                : 'Try joining a Classroom!'
                            }
                        </span>
                        {
                            user.role === 'teacher'
                            ? <ClassroomDialog
                                    type="create"
                                    onCreate={handleCreateClassroom}
                                />
                            : <JoinClassroomDialog
                                    version="outline"
                                    size="lg"
                                    onJoin={handleCreateClassroom}
                                />
                        }
                        </div>
                    : <ul className="flex flex-row flex-wrap gap-10 justify-center @6xl:justify-start">
                        {
                            classrooms && classrooms.map((c) => (
                                <li key={c.id}>
                                    <ClassroomCard 
                                        classroom={c}
                                        onDelete={handleDeleteClassroom}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                }
            </section>
        </>
    )
}
