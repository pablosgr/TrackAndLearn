'use client'

import { ClassroomType } from "@/types/classroom/ClassroomType";
import { useState } from "react";
import { useUser } from "@/components/userWrapper";

export default function ClassroomsPageClient({ data }: { data: ClassroomType[] | null }) {
    const [classrooms] = useState<ClassroomType[] | null>(data);
    const user = useUser();
    
    return (
        <div className="flex flex-row gap-8">
            {
                classrooms && classrooms.map((c) => (
                    <article key={c.id} className="p-6 border-1 border-gray-300 shadow-md rounded-lg flex flex-col gap-4">
                        <h3>{c.name}</h3>
                        {
                            user.role === 'student' && <p className="text-gray-300">Teacher: {c.teacher_name}</p>
                        }
                        <p className="text-gray-400">Go to classroom</p>
                    </article>
                ))
            }
        </div>
    )
}
