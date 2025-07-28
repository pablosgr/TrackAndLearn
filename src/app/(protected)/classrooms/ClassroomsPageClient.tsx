'use client'

import { ClassroomType } from "@/types/classroom/ClassroomType";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/components/context/userWrapper";

export default function ClassroomsPageClient({ data }: { data: ClassroomType[] }) {
    const [classrooms] = useState<ClassroomType[]>(data);
    const user = useUser();
    
    return (
        <div className="flex flex-row gap-8">
            {
                classrooms && classrooms.map((c) => (
                    <Link href={`/classrooms/${c.id}`} key={c.id}>
                        <article key={c.id} className="p-6 border-1 border-gray-300 shadow-md rounded-lg flex flex-col gap-4">
                            <h3>{c.name}</h3>
                            {
                                user.role === 'student' && <p className="text-gray-300">Teacher: {c.teacher?.name}</p>
                            }
                            <p className="text-gray-400">Go to classroom</p>
                        </article>
                    </Link>
                ))
            }
        </div>
    )
}
