'use server'

import { createClient } from "@/utils/supabase/server";
import { hashPassword } from "@/utils/general/hashPassword";

export async function sendOTP(email: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOtp({
        email: email
    });

    if (error) {
        throw new Error(error.message);
    }
}

export async function validateEmail(email: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
    
    if (!data || error) {
        console.error('Error validating email: ', error);
        throw new Error('Email is not registered');
    }
}

export async function resetPassword(newPassword: string, email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error(error);
        throw new Error('Error reseting password');
    }

    const hashedPassword = await hashPassword(newPassword);

    const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('email', email);

    if (updateError) {
        console.error(updateError);
        throw new Error('Error reseting hashed password');
    }
}
