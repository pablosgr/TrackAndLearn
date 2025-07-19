'use server'

import { createClient } from "@/utils/supabase/server";
import TestTemplateType from "@/types/test/TestTemplateType";
import { TestType } from "@/types/test/TestType";
import { RawTestResponse } from "@/types/test/RawTestType";

export async function getTestsTemplateByUserId(userId: string): Promise<TestTemplateType[] | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('test_template').select('*').eq('teacher_id', userId);

    if (error) {
        console.error('Failed to fetch tests', error);
        return null;
    }

    return data as TestTemplateType[];
}

export async function getTestById(testId: string): Promise <TestType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("test")
        .select(`
            id,
            template_id,
            name,
            level,
            time_limit,
            adaptation_id,
            created_at,
            test_template(teacher_id),
            question(
            id,
            question_text,
            options_number,
            index_order,
            option(
                id,
                option_text,
                is_correct,
                index_order
                )
            )
        `)
        .eq("template_id", testId)
        .single<RawTestResponse>();

        if (error) {
            console.error('Error fetching test: ', error);
            return null;
        }

        return data;
}
