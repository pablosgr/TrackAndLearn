'use server'

import { createClient } from "@/utils/supabase/server";

export async function getStudentAdaptationId(classroomId: string, studentId: string): Promise<string | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('student_classroom')
        .select('adaptation_id')
        .eq('classroom_id', classroomId)
        .eq('student_id', studentId)
        .single();

    if (!data || error) {
        console.error('Error retrieving student adaptation: ', error);
        return null;
    }

    return data.adaptation_id;
}
