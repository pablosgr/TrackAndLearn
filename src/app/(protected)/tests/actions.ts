'use server'

import { createClient } from "@/utils/supabase/server";
import TestTemplateType from "@/types/test/TestTemplateType";

export async function getTests(userId: string): Promise<TestTemplateType[] | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('test_template').select('*').eq('teacher_id', userId);

    if (error) {
        console.error('Failed to fetch tests', error);
        return null;
    }

    return data as TestTemplateType[];
}
