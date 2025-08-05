'use server'

import { createClient } from "@/utils/supabase/server";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { generateClassCode } from "@/utils/general/generateClassCode";

export async function createClassroom(name: string, teacherId: number): Promise<ClassroomType | null> {
    const supabase = await createClient();

    let code = generateClassCode();

    const { data: existingCode } = await supabase
        .from('classroom')
        .select('id')
        .eq('code', code);

    if (existingCode) {
        code = generateClassCode();
    }

    const { data, error } = await supabase
        .from('classroom')
        .insert({
            name: name,
            code: code,
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
