'use server'

import { createClient } from "@/utils/supabase/server";
import TestTemplateType from "@/types/test/TestTemplateType";

export async function createTest(name: string, topic: string, userId: string): Promise<TestTemplateType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test_template')
        .insert({
            name: name,
            topic_id: topic,
            teacher_id: userId
        })
        .select(`
            *,
            topic_data:topic(
                name
            )
        `);

    if (!data || error) {
        console.error('Error inserting test template record: ', error);
        return null;
    }

    const { data: testData, error: testError } = await supabase
        .from('test')
        .insert({
            template_id: data[0].id,
            name: data[0].name + ' - Standard',
        }).
        select();

    if (!testData || testError) {
        console.error('Error inserting test from template: ', error);
        return null;
    }

    return data[0] as TestTemplateType;
}
