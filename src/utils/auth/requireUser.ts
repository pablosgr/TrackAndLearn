import { createClient } from "../supabase/server";

export default async function requireUser() {
    const supabase = await createClient();
    
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userData.user?.id);

    if (!data || error) {
        console.error('Error retrieving user data: ', error);
        return null;
    }

    const user = {
        id: data[0].id,
        name: data[0].name,
        username: data[0].username,
        email: data[0].email,
        role: data[0].role,
        auth_id: data[0].auth_id,
        adaptation_id: data[0].adaptation_id,
        created_at: data[0].created_at
    }

    return user;
}
