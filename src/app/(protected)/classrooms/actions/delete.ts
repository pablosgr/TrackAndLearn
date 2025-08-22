'use server'

import { createClient } from "@/utils/supabase/server";
import { getTestsById } from "../../tests/actions/get";

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

export async function removeAssignment(assignmentId: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_assignment')
        .delete()
        .eq('id', assignmentId)
        .select()
        .single();

    if (!data || error) {
        console.error('Error removing assigned test: ', error);
    }

    const assignedTests = await getTestsById(data.test_template_id, 'template');

    const testIds = assignedTests.map((t) => t.id);

    const response = await supabase
        .from('test_result')
        .delete()
        .eq('classroom_id', data.classroom_id)
        .in('test_id', testIds);

    if (response.status !== 204 ) {
        console.error('Error removing test results: ', response.error?.message);
    }
}
