'use server'

import { createClient } from "@/utils/supabase/server";
import { ClassroomType } from "@/types/classroom/ClassroomType";

export async function createClassroom(name: string, teacherId: number): Promise<ClassroomType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('classroom')
        .insert({
            name: name,
            teacher_id: teacherId
        })
        .select()
        .single();

    if (!data || error) {
        console.error('Error inserting new classroom: ', error);
        return null;
    }

    return data as ClassroomType;
}
