'use server'

import { createClient } from "@/utils/supabase/server";
import { UserContextType } from "@/types/context/UserContextType";

export async function updateUserById(
    userId: string,
    formData: { name: string, username: string }
): Promise<UserContextType | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', userId)
        .select()
        .single();

    if (!data || error) {
        console.error('Error updating user information: ', error);
        return null;
    }

    return data;
}
