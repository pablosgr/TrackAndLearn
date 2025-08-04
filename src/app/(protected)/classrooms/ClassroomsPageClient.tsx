'use client'

import { ClassroomType } from "@/types/classroom/ClassroomType";
import { useState } from "react";
import ClassroomDialog from "@/components/classrooms/ClassroomDialog";
import ClassroomCard from "@/components/classrooms/ClassroomCard";

export default function ClassroomsPageClient({ data }: { data: ClassroomType[] }) {
    const [classrooms, setClassrooms] = useState<ClassroomType[]>(data);

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
                <ClassroomDialog
                    type="create"
                    onCreate={handleCreateClassroom}
                />
            </header>
            <section className="w-full flex flex-col justify-items-start">
                <div className="flex flex-row flex-wrap gap-9">
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
            </section>
        </>
    )
}
