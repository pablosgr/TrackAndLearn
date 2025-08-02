'use server'

import { createClient } from "@/utils/supabase/server";
import TestTemplateType from "@/types/test/TestTemplateType";
import { NewOptionType } from "@/types/test/OptionType";
import { NewQuestionType, QuestionType } from "@/types/test/QuestionType";

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

export async function createQuestion(
    questionData: NewQuestionType,
    optionsData: NewOptionType[]
): Promise<QuestionType | null> {
    const supabase = await createClient();

    const { data: lastIndex, error: indexError } = await supabase
        .from('question')
        .select('index_order')
        .eq('test_id', questionData.test_id)
        .order('index_order', { ascending: false })
        .limit(1)
        .single();

    if (!lastIndex || indexError) {
        console.error('Error retrieving question index: ', indexError);
        return null;
    }

    const { data: question, error: questionError } = await supabase
        .from('question')
        .insert({...questionData, index_order: lastIndex.index_order})
        .select();

    if (!question || questionError) {
        console.error('Error creating question: ', questionError);
        return null;
    }

    const formattedOptions = optionsData.map((opt) => (
        {
            ...opt,
            question_id: question[0].id,
        }
    ))

    const { error: optionsInsertError } = await supabase
        .from('option')
        .insert(formattedOptions);
    
    if (optionsInsertError) {
        console.error('Error inserting options for new question: ', optionsInsertError);
    }

    const { data: newQuestion, error: newQuestionError } = await supabase
        .from('question')
        .select(`
            *,
            option(
                *
            )
        `)
        .eq('id', question[0].id)
        .single();

    if (!newQuestion || newQuestionError) {
        console.error('Error retrieving new question: ', newQuestionError);
        return null;
    }

    return newQuestion as QuestionType;
}
