'use server'

import { createClient } from "@/utils/supabase/server";
import TestTemplateType from "@/types/test/TestTemplateType";
import { TestType } from "@/types/test/TestType";

export async function getTestTemplatesByUserId(userId: string): Promise<TestTemplateType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_template')
        .select('*')
        .eq('teacher_id', userId);

    if (error) {
        console.error('Failed to fetch tests', error);
        return [];
    }

    return data as TestTemplateType[];
}

export async function getTestByTemplateId(testId: string): Promise <TestType[]> {
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
        .eq("template_id", testId);

        if (!data || error) {
            console.error('Error fetching test: ', error);
            return [];
        }

        const tests: TestType[] = data.map((test): TestType => ({
            ...test,
            test_template: Array.isArray(test.test_template) ? test.test_template[0] ?? null : test.test_template,
        }));

        return tests;
}
