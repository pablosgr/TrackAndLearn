'use server'

import { createClient } from "@/utils/supabase/server";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { RawClassroomType } from "@/types/classroom/RawClassroomType";

export async function getClassroomsByRole(userId: string, userRole: string): Promise<ClassroomType[] | null> {
    const supabase = await createClient();

    if (userRole === 'teacher') {
        const { data, error } = await supabase
            .from('classroom')
            .select('*')
            .eq('teacher_id', userId);

        if (!data || error) {
            console.error("Error fetching teacher classrooms: ", error);
            return null;
        }

        return data;
    }

    if (userRole === 'student') {
        const { data, error } = await supabase
            .from("student_classroom")
            .select(`
                classroom(
                id,
                teacher_id,
                name,
                created_at,
                teacher:users!classroom_teacher_id_fkey(name)
                )
            `)
            .eq("student_id", userId);

        if (!data || error) {
            console.error("Error fetching student classrooms: ", error);
            return null;
        }

        const classroomsFilter = (data as RawClassroomType[]).flatMap(item => item.classroom);

        const classrooms: ClassroomType[] = classroomsFilter.map((c) => (
            {
                ...c,
                teacher_name: c.teacher?.name,
            }
        ))

        return classrooms;
    }

    return null;
}
