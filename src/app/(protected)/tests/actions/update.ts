'use server'

import { createClient } from "@/utils/supabase/server";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import { NewTestType, TestType } from "@/types/test/TestType";

export async function updateQuestionById(questionId: number, data: EditQuestionType) {
    const supabase = await createClient();

    const { data: prevOps, error: prevOpsError } = await supabase
        .from('option')
        .select('id')
        .eq('question_id', questionId);

    if (!prevOps || prevOpsError) {
        console.error('Error obtaining options data: ', prevOpsError);
        return;
    }

    const currOps = data.options.flatMap((opt) => opt.id);

    const deletedOptions = (prevOps.filter((opt) => !currOps.includes(opt.id))).flatMap((opt) => opt.id);

    if (deletedOptions.length > 0) {
        const { error: deleteOptionsError } = await supabase
            .from('option')
            .delete()
            .in('id', deletedOptions);

        if (deleteOptionsError) {
            console.error("Error deleting options: ", deleteOptionsError);
        }
    }

    const { data: questionData, error: questionError } = await supabase
        .from('question')
        .update({ 
            question_text: data.question_text,
            options_number: data.options_number,
        })
        .eq('id', questionId)
        .select();

    if (!questionData || questionError) {
        console.error('Error updating question info: ', questionError);
        return;
    }

    const optionsToUpdate = data.options.filter((opt) => opt.id !== null);

    if (optionsToUpdate.length > 0) {
        const updates = optionsToUpdate.map((opt) =>
            supabase
                .from('option')
                .update(opt)
                .eq('id', opt.id)
        );

        const results = await Promise.all(updates);

        results.forEach(({ error }, index) => {
            if (error) {
                console.error(`Error updating option ${optionsToUpdate[index].id}`, error);
            }
        });
    }

    const optionsToInsert = data.options.filter((opt) => !opt.id);

    const formattedOptionsToInsert = optionsToInsert.map((opt) => (
        {
            question_id: questionId,
            option_text: opt.option_text,
            is_correct: opt.is_correct,
            index_order: opt.index_order,
        }
    ))

    if (formattedOptionsToInsert.length > 0) {
        const { data: insertData, error: insertError } = await supabase
            .from('option')
            .insert(formattedOptionsToInsert)
            .select();

        if (!insertData || insertError) {
            console.error('Error inserting new options: ', insertError);
        }
    }
}

export async function updateTestById(testId: number, formData: NewTestType): Promise<TestType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('test')
        .update({
            name: formData.name,
            level: formData.level,
            time_limit: formData.time_limit,
            adaptation_id: formData.adaptation_id
        })
        .eq('id', testId)
        .select()
        .single();
    
    if (!data || error) {
        console.error('Error updating test: ', error);
        return null;
    }

    return data as TestType;
}
