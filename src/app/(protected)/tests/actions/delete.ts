'use server'

import { createClient } from "@/utils/supabase/server";

export async function deleteTestTemplateById(templateId: string) {
    const supabase = await createClient();

    const response = await supabase
        .from('test_template')
        .delete()
        .eq('id', templateId);

    if (response.status !== 204) {
        console.error('Error deleting test template: ', response.statusText);
    }
}

export async function deleteTestById(testId: number) {
    const supabase = await createClient();

    const response = await supabase
        .from('test')
        .delete()
        .eq('id', testId);

    if (response.status !== 204) {
        console.error('Error deleting test: ', response.statusText);
    }
}

export async function deleteQuestionById(questionId: number) {
    const supabase = await createClient();

    const response = await supabase
        .from('question')
        .delete()
        .eq('id', questionId);
    
    if (response.status !== 204) {
        console.error('Error deleting question: ', response.statusText);
    }
}
