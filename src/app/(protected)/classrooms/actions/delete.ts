'use server'

import { createClient } from "@/utils/supabase/server";

export async function deleteClassroomById(classroomId: number) {
    const supabase = await createClient();

    const response = await supabase
        .from('classroom')
        .delete()
        .eq('id', classroomId);

    if (response.status !== 204) {
        console.error('Error deleting classroom: ', response.statusText);
    }
}

export async function removeStudentFromClassroom(studentId: number, classroomId: number) {
    const supabase = await createClient();

    const response = await supabase
        .from('student_classroom')
        .delete()
        .eq('student_id', studentId)
        .eq('classroom_id', classroomId);

    if (response.status !== 204) {
        console.error('Error removing student: ', response.statusText);
    }
}
