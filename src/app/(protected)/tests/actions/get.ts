'use server'

import { createClient } from "@/utils/supabase/server";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { TestType } from "@/types/test/TestType";
import { TopicType } from "@/types/test/TopicType";
import { OptionType } from "@/types/test/OptionType";
import { AdaptationType } from "@/types/test/AdaptationType";

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

export async function getTestTemplatesByUserId(
    userId: string,
    range?: number[]
): Promise<TestTemplateType[]> {
    const supabase = await createClient();

    let query = supabase
        .from('test_template')
        .select(`
            *,
            topic_data:topic(
                name
            )
        `)
        .eq('teacher_id', userId)
        .order('created_at', { ascending: false });

    if (range) {
        query.range(range[0], range[1]);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Failed to fetch tests', error);
        return [];
    }

    return data as TestTemplateType[];
}

export async function getTestsById(
    ids: string | string[],
    filterBy: 'test' | 'template'
): Promise <TestType[]> {
    const supabase = await createClient();

    let query = supabase
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
                *,
                option(
                    *
                )
            )
        `)
        .order('id', { ascending: true})
        .order('index_order', { referencedTable: 'question', ascending: true })
        .order('index_order', { referencedTable: 'question.option', ascending: true });

    filterBy === 'template' && query.eq("template_id", ids);
    (filterBy === 'test' && Array.isArray(ids)) && query.in("id", ids);

    const { data, error } = await query;

        if (!data || error) {
            console.error('Error fetching test: ', error);
            return [];
        }

        const tests: TestType[] = data.map((test): TestType => ({
            ...test,
            adaptation_data: Array.isArray(test.adaptation_data) ? test.adaptation_data[0] ?? null : test.adaptation_data,
            test_template: Array.isArray(test.test_template) ? test.test_template[0] ?? null : test.test_template,
        }));

        return tests as TestType[];
}

export async function getTopics(): Promise<TopicType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('topic')
        .select('*')
        .order('name', { ascending: true });
    
    if (!data || error) {
        console.error('Error retrieving topics');
        return [];
    }

    return data as TopicType[];
}

export async function getAdaptations(): Promise<AdaptationType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('adaptation')
        .select('*');
    
    if (!data || error) {
        console.error('Error retrieving adaptations');
        return [];
    }

    return data as AdaptationType[];
}

export async function getOptionsByQuestionId(questionId: number): Promise<OptionType[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('option')
        .select('*')
        .eq('question_id', questionId)
        .order('index_order', { ascending: true });

    if (!data || error) {
        console.error('Error retrieving options: ', error);
        return [];
    }
    
    return data as OptionType[];
}
