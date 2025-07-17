import { createClient } from "../supabase/server";

export default async function requireUser() {
    const supabase = await createClient();
    
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase.from('users').select('*').eq('auth_id', userData.user?.id);

    if (data) {
        const user = {
            id: data[0].id,
            name: data[0].name,
            username: data[0].username,
            role: data[0].role,
            email: data[0].email,
            adaptation_id: data[0].adaptation_id,
            auth_id: data[0].auth_id
        }

        return user;
    }

    return null;
}
