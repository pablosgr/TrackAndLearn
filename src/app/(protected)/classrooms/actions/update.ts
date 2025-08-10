'use server'

import { createClient } from "@/utils/supabase/server";
import { generateClassCode } from "@/utils/general/generateClassCode";
import { TestResultType } from "@/types/test/TestResultType";

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

export async function updateClassroomName(classroomId: number, newName: string): Promise<string | null> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('classroom')
        .update({ name: newName })
        .eq('id', classroomId);
    
    if (error) {
        console.error('Error updating classroom name: ', error);
        return null;
    }

    return newName;
}

export async function updateResultVisibility(assignmentId: number, isVisible: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('test_assignment')
        .update({ is_result_visible: isVisible })
        .eq('id', assignmentId);
    
    if (error) {
        console.error('Error updating result visibility', error);
    }
}

export async function updateTestResult(finalResult: TestResultType) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('test_result')
        .update(finalResult)
        .eq('id', finalResult.id);
    
    if (error) {
        console.error('Error updating test result', error);
    }
}

export async function updateStudentAdaptation(
    adaptationId: number | null,
    classroomId: number,
    studentId: number
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('student_classroom')
        .update({
            adaptation_id: adaptationId
        })
        .eq('classroom_id', classroomId)
        .eq('student_id', studentId);
    
    if (error) {
        console.error('Error updating student adaptation', error);
    }
}
