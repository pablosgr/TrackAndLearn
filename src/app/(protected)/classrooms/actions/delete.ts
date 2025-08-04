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
