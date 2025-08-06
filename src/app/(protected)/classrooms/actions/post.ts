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

export async function enrollStudent(
    studentId: string,
    classroomCode: string
): Promise<{ 
    success: boolean,
    message: string,
    classroom?: ClassroomType,
}> {
    const supabase = await createClient();

    const { data: classroom, error: classroomError } = await supabase
        .from('classroom')
        .select('*')
        .eq('code', classroomCode)
        .single();

    if (!classroom || classroomError){
        return {
            success: false,
            message: 'Classroom not found. Please, check the code',
        };
    }

    const { error: insertError } = await supabase
        .from('student_classroom')
        .insert({
            classroom_id: classroom.id,
            student_id: studentId
        });

    if (insertError) {
        return {
            success: false,
            message: 'Could not join the classroom. You may already be enrolled.',
        };
    }

    return {
        success: true,
        message: 'Enrolled succesfully',
        classroom: classroom,
    }
}
