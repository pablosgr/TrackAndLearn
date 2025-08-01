'use server'

import { createClient } from "@/utils/supabase/server";
import TestTemplateType from "@/types/test/TestTemplateType";
import { TestType } from "@/types/test/TestType";
import { TopicType } from "@/types/test/TopicType";
import { OptionType } from "@/types/test/OptionType";

export async function getTestTemplate(templateId: string): Promise<TestTemplateType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_template')
        .select(`
            *,
            topic_data:topic(
                name
            )
        `)
        .eq('id', templateId);

    if (!data || error) {
        console.error('Failed to get test template', error);
        return null;
    }

    return data[0] as TestTemplateType;
}

export async function getTestTemplatesByUserId(userId: string): Promise<TestTemplateType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_template')
        .select(`
            *,
            topic_data:topic(
                name
            )
        `)
        .eq('teacher_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch tests', error);
        return [];
    }

    return data as TestTemplateType[];
}

export async function getTestsByTemplateId(testId: string): Promise <TestType[]> {
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
            adaptation_data:adaptation(
                name,
                code
            ),
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
            adaptation_data: Array.isArray(test.adaptation_data) ? test.adaptation_data[0] ?? null : test.adaptation_data,
            test_template: Array.isArray(test.test_template) ? test.test_template[0] ?? null : test.test_template,
        }));

        return tests;
}

export async function getTopics(): Promise<TopicType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('topic')
        .select('*');
    
    if (!data || error) {
        console.error('Error retrieving topics');
        return [];
    }

    return data as TopicType[];
}

export async function getOptionsByQuestionId(questionId: number): Promise<OptionType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('option')
        .select('*')
        .eq('question_id', questionId);

    if (!data || error) {
        console.error('Error retrieving options: ', error);
        return [];
    }
    
    return data as OptionType[];
}
