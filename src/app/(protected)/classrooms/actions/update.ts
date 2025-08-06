'use server'

import { createClient } from "@/utils/supabase/server";
import { generateClassCode } from "@/utils/general/generateClassCode";

export async function resetClassCode(classroomId: number): Promise<string | null> {
    const supabase = await createClient();
    
    const newCode = generateClassCode();

    const { error } = await supabase
        .from('classroom')
        .update({ code: newCode })
        .eq('id', classroomId);
    
    if (error) {
        console.error('Error regenerating classroom code: ', error);
        return null;
    }

    return newCode;
}
