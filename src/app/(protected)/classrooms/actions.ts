'use server'

import { createClient } from "@/utils/supabase/server";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { RawSupabaseClassroomType } from "@/types/classroom/RawClassroomType";
import { RawClassroomType } from "@/types/classroom/RawClassroomType";
import { RawStudentType } from "@/types/user/RawStudentFile";
import { StudentType } from "@/types/user/StudentType";
import { AssignedTestType } from "@/types/test/AssignedTestType";

export async function getClassroomsByRole(userId: string, userRole: string): Promise<ClassroomType[]> {
    const supabase = await createClient();

    if (userRole === 'teacher') {
        const { data, error } = await supabase
            .from('classroom')
            .select('*')
            .eq('teacher_id', userId);

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
                    created_at,
                    teacher:users!classroom_teacher_id_fkey(name)
                )
            `)
            .eq("student_id", userId);

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
            student:users(
                id,
                name,
                username,
                email,
                adaptation_id
            )
        `)
        .eq('classroom_id', classroomId);

    if (!data || error) {
        console.error('Error fetching classroom students: ', error);
        return [];
    }

    const students = (data as RawStudentType[]).flatMap(item => item.student);

    return students as StudentType[];
}

export async function getAssignedTests(classroomId: string): Promise<AssignedTestType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_assignment')
        .select(`
            id,
            classroom_id,
            test_template_id,
            assigned_at,
            due_date,
            test_template(
                id,
                name,
                teacher_id,
                topic_id,
                created_at
            )
        `)
        .eq('classroom_id', classroomId);

        if (!data || error) {
            console.error('Error fetching assigned tests: ', error);
            return [];
        }

        return data?.map(item => ({
            ...item,
            test_template: Array.isArray(item.test_template) ? item.test_template[0] : item.test_template
        })) as AssignedTestType[];
}

export async function verifyEnrollment(userId: string, classroomId: number): Promise<boolean> {
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
