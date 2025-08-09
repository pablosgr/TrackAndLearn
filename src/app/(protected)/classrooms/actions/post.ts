'use server'

import { createClient } from "@/utils/supabase/server";
import { generateClassCode } from "@/utils/general/generateClassCode";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { AssignedTestType } from "@/types/test/AssignedTestType";
import { TestResultType } from "@/types/test/TestResultType";
import { NewTestResponseType } from "@/types/test/TestResponseType";

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

export async function createTestResult(
    userId: string,
    classroomId: string,
    testId: number
): Promise<TestResultType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_result')
        .insert({
            student_id: userId,
            classroom_id: classroomId,
            test_id: testId,
            status: 'ongoing'
        })
        .select('*')
        .single();

    if (!data || error) {
        console.error('Error creating test result: ', error);
        return null;
    }

    return data;
}

export async function createTestResponses(testResponses: NewTestResponseType[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('test_response')
        .insert(testResponses);

    if (error) {
        console.error('Error inserting test responses: ', error);
    }
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

export async function assignTestTemplate(classroomId: number, templateId: number): Promise<AssignedTestType | null> {
    const supabase = await createClient();

    const { data: assignmentCheck } = await supabase
        .from('test_assignment')
        .select('id')
        .eq('classroom_id', classroomId)
        .eq('test_template_id', templateId)
        .single();

    if (assignmentCheck) {
        console.error('Test already assigned');
        return null;
    }

    const { data, error } = await supabase
        .from('test_assignment')
        .insert({
            classroom_id: classroomId,
            test_template_id: templateId,
            is_result_visible: false,
        })
        .select(`
            id,
            classroom_id,
            test_template_id,
            assigned_at,
            due_date,
            is_result_visible,
            test_template(
                id,
                name,
                teacher_id,
                topic_id,
                created_at
            )
        `)
        .single();

    if (!data || error) {
        console.error('Error assigning test: ', error);
        return null;
    }

    return data as AssignedTestType;
}
