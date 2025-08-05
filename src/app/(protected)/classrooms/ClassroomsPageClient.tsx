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
    const noClassrooms = classrooms.length === 0;

    const handleCreateClassroom = (newClassroom: ClassroomType) => {
        setClassrooms(prev => [newClassroom, ...prev]);
    }

    const handleDeleteClassroom = (classroomId: number) => {
        setClassrooms(prev => prev.filter((item) => item.id !== classroomId));
    }
    
    return (
        <>
            <header className="w-full flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl">My Classrooms</h1>
                {
                    user.role === 'teacher'
                    ? <ClassroomDialog
                        type="create"
                        onCreate={handleCreateClassroom}
                    />
                    : !noClassrooms && <JoinClassroomDialog version="default"/>
                }
            </header>
            <section className={`w-full flex flex-col ${noClassrooms ? 'h-full items-center' : 'items-start'}`}>
                {
                    noClassrooms
                    ? <div className="h-full flex flex-col justify-center gap-3">
                        <span className="text-lg">Try joining a Classroom!</span>
                        <JoinClassroomDialog 
                            version="outline"
                            size="lg"
                        />
                        </div>
                    : <div className="flex flex-row flex-wrap gap-9">
                        {
                            classrooms && classrooms.map((c) => (
                                <ClassroomCard 
                                    key={c.id}
                                    classroom={c}
                                    onDelete={handleDeleteClassroom}
                                />
                            ))
                        }
                    </div>
                }
            </section>
        </>
    )
}
