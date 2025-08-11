'use server'

import { createClient } from "@/utils/supabase/server";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { RawSupabaseClassroomType } from "@/types/classroom/RawClassroomType";
import { RawClassroomType } from "@/types/classroom/RawClassroomType";
import { RawStudentType, RawDBStudentType } from "@/types/user/RawStudentFile";
import { StudentType } from "@/types/user/StudentType";
import { AssignedTestType } from "@/types/test/AssignedTestType";
import { TestResultType } from "@/types/test/TestResultType";
import { ClassroomResultType } from "@/types/test/ClassroomResultType";

export async function getClassroomsByRole(userId: string, userRole: string): Promise<ClassroomType[]> {
    const supabase = await createClient();

    if (userRole === 'teacher') {
        const { data, error } = await supabase
            .from('classroom')
            .select('*')
            .eq('teacher_id', userId)
            .order('id', { ascending: false });

        if (!data || error) {
            console.error("Error fetching teacher classrooms: ", error);
            return [];
        }

        return data;
    }

    if (userRole === 'student') {
        const { data, error } = await supabase
            .from("student_classroom")
            .select(`
                classroom(
                    id,
                    teacher_id,
                    name,
                    code,
                    created_at,
                    teacher:users!classroom_teacher_id_fkey(name)
                )
            `)
            .eq("student_id", userId)
            .order("classroom_id", { ascending: false });

        if (!data || error) {
            console.error("Error fetching student classrooms: ", error);
            return [];
        }

        const classroomsFilter = (data as RawClassroomType[]).flatMap(item => item.classroom);

        const classrooms: ClassroomType[] = classroomsFilter.map((c) => (
            {
                ...c,
                teacher: { name: c.teacher?.name }
            }
        ))

        return classrooms;
    }

    return [];
}

export async function getClassroomById(classroomId: string): Promise<ClassroomType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('classroom')
        .select(`
            id, 
            teacher_id,
            name,
            code,
            created_at,
            teacher:users!classroom_teacher_id_fkey(name)
        `)
        .eq('id', classroomId)
        .single<RawSupabaseClassroomType>();

    if (!data || error) {
        console.error("Error fetching classroom data: ", error);
        return null;
    }

    return data as ClassroomType;
}

export async function getClassroomStudents(classroomId: string): Promise<StudentType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('student_classroom')
        .select(`
            student:users!student_id(
                id,
                name,
                username,
                email
            ),
            adaptation_id,
            adaptation_data:adaptation!adaptation_id(
                name,
                code
            )
        `)
        .eq('classroom_id', classroomId);

    if (!data || error) {
        console.error('Error fetching classroom students: ', error);
        return [];
    }

    const students = ((data as unknown) as RawStudentType[]).map(item => ({
        id: item.student.id,
        name: item.student.name,
        username: item.student.username,
        email: item.student.email,
        adaptation_id: item.adaptation_id ?? null,
        adaptation_data: item.adaptation_data ?? null
    }));

    return students as StudentType[];
}

async function getCompletedTestTemplates(
    testTemplateIds: string[],
    userId: string,
    classroomId: string
): Promise<
    Set<string>
> {
    const supabase = await createClient();

    const { data: testData, error: errorData } = await supabase
        .from('test')
        .select('id, template_id')
        .in('template_id', testTemplateIds);

    if (!testData || errorData) {
        console.error('Error retrieving test ids: ', errorData);
        return new Set<string>();
    }

    const testIdToTemplateId = new Map<string, string>();

    testData.forEach((t) => {
        testIdToTemplateId.set(t.id, t.template_id);
    })

    const testIds = testData.map((t) => t.id);

    const { data: resultData, error: resultError } = await supabase
        .from('test_result')
        .select('test_id')
        .eq('student_id', userId)
        .eq('classroom_id', classroomId)
        .eq('status', 'completed')
        .in('test_id', testIds);

    if (!resultData || resultError) {
        console.error('Error checking results: ', resultError);
        return new Set<string>();
    }

    const completedTemplateIds = new Set<string>();

    resultData.forEach(({ test_id }) => {
        const templateId = testIdToTemplateId.get(test_id);
        if (templateId) completedTemplateIds.add(templateId);
    });

    return completedTemplateIds;
}

export async function getAssignedTests(classroomId: string, userId: string): Promise<AssignedTestType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_assignment')
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
        .eq('classroom_id', classroomId)
        .order('id', { ascending: false });

        if (!data || error) {
            console.error('Error fetching assigned tests: ', error);
            return [];
        }

        const testTemplateIds = data.map((item) => item.test_template_id);

        const completedTemplateIds = await getCompletedTestTemplates(testTemplateIds, userId, classroomId);

        return data?.map(item => ({
            ...item,
            test_template: Array.isArray(item.test_template) ? item.test_template[0] : item.test_template,
            has_result: completedTemplateIds.has(item.test_template_id)
        })) as AssignedTestType[];
}

export async function getStudentTestResult(
    testId: number,
    templateId: string,
    userId: string,
    classroomId: string
): Promise<TestResultType | null> {
    const supabase = await createClient();

    const { data: assignData } = await supabase
        .from('test_assignment')
        .select('is_result_visible')
        .eq('classroom_id', classroomId)
        .eq('test_template_id', templateId)
        .single();

    if (!assignData || !assignData.is_result_visible) {
        return null;
    }
    
    const { data, error } = await supabase
        .from('test_result')
        .select(`
            *,
            response:test_response(
                *
            )
        `)
        .eq('test_id', testId)
        .eq('classroom_id', classroomId)
        .eq('student_id', userId)
        .single();

    if (!data || error) {
        console.error('Error retrieving test result: ', error);
        return null;
    }

    return data as TestResultType;
}

export async function getClassroomTestResults(classroomId: string, templateId: string): Promise<ClassroomResultType[]> {
    const supabase = await createClient();

    const { data: testData, error: testError } = await supabase
        .from('test')
        .select('id')
        .eq('template_id', templateId);

    if (!testData || testError) {
        console.error('Error retrieving tests related to template: ', testError);
        return [];
    }

    const testIds = testData.flatMap((t) => t.id);

    const { data, error } = await supabase
        .from('test_result')
        .select(`
            *,
            test_data:test(
                name,
                level,
                time_limit,
                adaptation_id,
                test_adaptation:adaptation(
                    name,
                    code
                )
            ),
            student_data:users(
                id,
                name,
                username,
                email
            ),
            response:test_response(
                *
            )
        `)
        .in('test_id', testIds)
        .eq('classroom_id', classroomId)
        .order('score', { ascending: true });

    if (!data || error) {
        console.error('Error retrieving test results from classroom: ', error);
        return [];
    }

    const results = data.map((item) => ({
        ...item,
        student_data: {
            id: item.student_data.id,
            name: item.student_data.name,
            username: item.student_data.username,
            email: item.student_data.email,
            adaptation_id: item.test_data.adaptation_id,
            adaptation_data: item.test_data.test_adaptation,
        }
    }));

    return results as ClassroomResultType[];
}

export async function verifyClassroomEnrollment(userId: string, classroomId: number): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('student_classroom')
        .select('*')
        .eq('classroom_id', classroomId)
        .eq('student_id', userId);

    if (!data || error) {
        console.error('Error validating enrollment: ', error);
        return false;
    }

    if (data.length === 0) {
        return false;
    }

    return true;
}

export async function verifyClassroomOwnership(userId: string, classroomId: number): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('classroom')
        .select('id')
        .eq('id', classroomId)
        .eq('teacher_id', userId);

    if (!data || error) {
        console.error('Error validating ownership: ', error);
        return false;
    }

    if (data.length === 0) {
        return false;
    }

    return true;
}

export default async function getResult(
    userId: string,
    classroomId: string,
    testId: number
): Promise<TestResultType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_result')
        .select('*')
        .eq('classroom_id', classroomId)
        .eq('student_id', userId)
        .eq('test_id', testId)
        .single();

    if (!data || error ) {
        return null;
    }

    return data;
}

