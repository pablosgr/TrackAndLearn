'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { hashPassword } from "@/utils/general/hashPassword";

export async function logIn(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error('Failed to log in', error);
        return { error: 'Invalid credentials' };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const supabaseData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(supabaseData);

    if (signUpError) {
        console.error('Failed to insert user in Supabase auth table', signUpError);
        return { error: 'Could not sign up' };
    }

    const hashedPassword = await hashPassword(supabaseData.password);

    const data = {
        name: formData.get('name'),
        username: formData.get('username'),
        email: formData.get('email'),
        role: formData.get('role'),
        password_hash: hashedPassword,
        auth_id: signUpData.user?.id
    }

    const { error: insertError } = await supabase.from('users').insert(data);

    if (insertError) {
        console.error('Failed to insert user in DB', insertError);
        return { error: 'Could not register user in database' };
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
