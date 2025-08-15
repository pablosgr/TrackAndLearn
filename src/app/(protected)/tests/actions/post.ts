'use server'

import { createClient } from "@/utils/supabase/server";
import { getTestsById } from "./get";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { NewOptionType } from "@/types/test/OptionType";
import { TopicType } from "@/types/test/TopicType";
import { NewQuestionType, QuestionType } from "@/types/test/QuestionType";
import { NewTestType, TestType } from "@/types/test/TestType";
import { LLMTestResponseType } from "@/types/llm/LLMTestResponseType";

export async function createTemplate(name: string, topic: string, userId: string): Promise<TestTemplateType | null> {
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

export async function createTest(newTest: NewTestType): Promise<TestType | null> {
    const supabase = await createClient();

    const { data: adaptationData, error: adaptationError } = await supabase
        .from('adaptation')
        .select('code')
        .eq('id', newTest.adaptation_id)
        .single();

    if (!adaptationData || adaptationError) {
        console.error('Error retrieving adaptation data in test insert: ', adaptationError);
        return null;
    }

    const formattedName = newTest.name + ' - ' + adaptationData.code + ' Adapted';

    const { data, error } = await supabase
        .from('test')
        .insert({
            template_id: newTest.template_id,
            name: formattedName,
            level: newTest.level,
            time_limit: newTest.time_limit,
            adaptation_id: newTest.adaptation_id,
        })
        .select()
        .single();

    if (!data || error) {
        console.error('Error inserting test: ', error);
        return null;
    }

    return data as TestType;
}

export async function createGeneratedTest(
    data: LLMTestResponseType,
    userId: string,
    topic: TopicType,
    level: string,
    adaptationId: number | null,
): Promise<TestTemplateType | null> {
    const supabase = await createClient();

    const { data: templateData, error: templateError } = await supabase
        .from('test_template')
        .insert({
            name: data.test_template_name,
            teacher_id: userId,
            topic_id: topic.id
        })
        .select('*')
        .single();

    if (!templateData || templateError) {
        console.error('Error inserting generated template');
        return null;
    }

    const testsToInsert = data.tests.map((test, index) => ({
        template_id: templateData.id,
        name: test.name,
        level: level,
        time_limit: test.time_limit,
        adaptation_id: index === 0 ? null : adaptationId
    }));

    try {
        await createGeneratedTestVersions(data, testsToInsert);
    } catch (e) {
        console.error(e);
        return null;
    }

    const formattedTemplate = {
        ...templateData,
        topic_data: {
            name: topic.name
        }
    }

    return formattedTemplate;
}

export async function createGeneratedTestVersions(
    data: LLMTestResponseType,
    testsToInsert: NewTestType[]
): Promise<TestType[]> {
    const supabase = await createClient();

    const { data: testData, error: testError } = await supabase
        .from('test')
        .insert(testsToInsert)
        .select('id');
    
    if (!testData || testError) {
        throw new Error('Error inserting generated test/s');
    }

    const questionsToInsert = data.tests.flatMap((test, index) => 
        test.questions.map((q) => ({
            test_id: testData[index].id,
            question_text: q.question_text,
            options_number: q.options_number,
            index_order: q.index_order
        }))
    );

    const { data: questionData, error: questionError } = await supabase
        .from('question')
        .insert(questionsToInsert)
        .select('id');
    
    if (!questionData || questionError) {
        throw new Error('Error inserting generated questions');
    }

    let questionCounter = 0;

    const optionsToInsert = data.tests.flatMap((test) =>
        test.questions.flatMap((question) => {
            const opts = question.options.map((opt) => ({
                question_id: questionData[questionCounter].id,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
                index_order: opt.index_order
            }));
            questionCounter++;
            return opts;
        })
    );

    const { error: optionError } = await supabase
        .from('option')
        .insert(optionsToInsert);
    
    if (optionError) {
        throw new Error('Error inserting generated options');
    }

    const testIds = testData.flatMap((t) => t.id);

    const recoveredTests = await getTestsById(testIds, 'test');

    return recoveredTests;
}

export async function createQuestion(
    questionData: NewQuestionType,
    optionsData: NewOptionType[]
): Promise<QuestionType | null> {
    const supabase = await createClient();
    let baseIndex = {
        index_order: 0,
    };

    const { data: lastIndex } = await supabase
        .from('question')
        .select('index_order')
        .eq('test_id', questionData.test_id)
        .order('index_order', { ascending: false })
        .limit(1)
        .single();

    if (lastIndex) {
        baseIndex = {
            index_order: lastIndex.index_order
        }
    }

    const { data: question, error: questionError } = await supabase
        .from('question')
        .insert({...questionData, index_order: baseIndex.index_order + 1})
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
