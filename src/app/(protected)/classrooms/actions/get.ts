'use server';

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

export async function getTopicByTestId(testId: number): Promise<string | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test')
        .select(`
            template_id,
            template_data:test_template!template_id(
                topic_id,
                topic_data:topic!topic_id(
                    name
                )
            )
        `)
        .eq('id', testId)
        .single();

    if (!data || error) {
        console.error('Error retrieving topic name: ', error);
        return null;
    }

    // @ts-expect-error: Supabase returns single objects when using ! in relations
    return data.template_data.topic_data.name as string;
}
