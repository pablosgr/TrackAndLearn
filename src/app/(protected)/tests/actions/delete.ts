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
