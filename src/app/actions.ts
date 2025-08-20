'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { hashPassword } from "@/utils/general/hashPassword";

export async function signIn(formData: { email: string, password: string }) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(formData);

    if (error) {
        console.error('Failed to sign in', error);
        throw new Error('Invalid credentials');
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signUp(
    formData: {
        name: string,
        username: string,
        email: string,
        password: string,
        role: string,
    }
) {
    const supabase = await createClient();

    const supabaseData = {
        email: formData.email,
        password: formData.password
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(supabaseData);

    if (signUpError) {
        console.error('Failed to insert user in Supabase auth table', signUpError);

        if (signUpError.status === 422) {
            throw new Error('Email or username already in use');
        }

        throw new Error('Error signing up');
    }

    const hashedPassword = await hashPassword(supabaseData.password);

    const data = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password_hash: hashedPassword,
        auth_id: signUpData.user?.id
    }

    const { error: insertError } = await supabase.from('users').insert(data);

    if (insertError) {
        console.error('Failed to insert user in DB', insertError);
        throw new Error('Error signing up');
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signOut() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Failed to sign out', error);
        return { error: 'Error signing out' }
    }

    revalidatePath('/', 'layout');
    redirect('/');
}
