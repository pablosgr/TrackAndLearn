'use server'

import { createClient } from "@/utils/supabase/server";
import { UserContextType } from "@/types/context/UserContextType";
import { hashPassword } from "@/utils/general/hashPassword";

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

export async function updatePassword(
    userId: string,
    email: string,
    password: string,
    newPassword: string
) {
    const supabase = await createClient();

    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (loginError) {
        throw new Error('Incorrect password');
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error(error);
        throw new Error('Error updating password');
    }

    const hashedPassword = await hashPassword(newPassword);

    const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', userId);

    if (updateError) {
        console.error(updateError);
        throw new Error('Error updating hashed password');
    }
}
