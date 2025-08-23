'use client';

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/components/context/userWrapper";
import { getClassroomsByRole } from "./actions";
import { showToast } from "@/utils/general/showToast";
import { Button } from "@/components/ui/button";
import ClassroomDialog from "@/components/classrooms/ClassroomDialog";
import JoinClassroomDialog from "@/components/classrooms/JoinClassroomDialog";
import ClassroomCard from "@/components/classrooms/ClassroomCard";
import { ClassroomType } from "@/types/classroom/ClassroomType";

export default function ClassroomsPageClient({ data }: { data: ClassroomType[] }) {
    const {user} = useUser();
    const [classrooms, setClassrooms] = useState<ClassroomType[]>(data);
    const [range, setRange] = useState<[number, number]>([6, 11]);
    const [isloading, setIsLoading] = useState<boolean>(false);
    const hasClassrooms = classrooms.length > 0;

    const handleCreateClassroom = (newClassroom: ClassroomType) => {
        setClassrooms(prev => [newClassroom, ...prev]);
    }

    const handleDeleteClassroom = (classroomId: number) => {
        setClassrooms(prev => prev.filter((item) => item.id !== classroomId));
    }

    const handleFetchClassrooms = async () => {
        setIsLoading(true);
        const newClassrooms: ClassroomType[] = await getClassroomsByRole(user.id, user.role, [range[0], range[1]]);

        if (newClassrooms.length > 0) {
            setClassrooms(prev => [...prev, ...newClassrooms]);
            setRange([range[1] + 1, range[1] + 6]);
        } else {
            showToast('No classrooms found', 'error');
        }

        setIsLoading(false);
    }
    
    return (
        <>
            <header className="w-full flex flex-row flex-wrap items-center justify-between gap-6 pb-10">
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
                    ? <div className="h-full flex flex-col justify-center gap-5">
                        <span className="text-2xl">
                            {
                                user.role === 'teacher'
                                ? 'Start creating a Classroom!'
                                : 'Try joining a Classroom!'
                            }
                        </span>
                        <div className="flex justify-center items-center">
                            {
                                user.role === 'teacher'
                                ? <ClassroomDialog
                                        type="create"
                                        onCreate={handleCreateClassroom}
                                    />
                                : <JoinClassroomDialog
                                        version="default"
                                        onJoin={handleCreateClassroom}
                                    />
                            }
                        </div>
                        </div>
                    : <ul className="flex-1 flex flex-row flex-wrap gap-20 justify-center @3xl:justify-start">
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
            {
                hasClassrooms && (
                    <footer className="w-full mt-auto pt-15 flex flex-row items-center justify-center">
                        <Button
                            onClick={handleFetchClassrooms}
                            variant={'outline'}
                            disabled={isloading}
                            className="w-fit text-[17px] p-6 rounded-2xl flex flex-row gap-4 items-center"
                        >
                            {
                                isloading
                                ? <>
                                    <LoaderCircle className="animate-spin" />
                                    Loading..
                                    </>
                                : 'Load more classrooms'
                            }
                        </Button>
                    </footer>
                )
            }
        </>
    )
}
