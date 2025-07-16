import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export default async function requireRole(allowedRoles: string[]) {
    const supabase = await createClient();
    
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase.from('users').select('role').eq('auth_id', userData.user?.id);

    if (!data || !data[0] || !allowedRoles.includes(data[0].role)) {
        redirect('/unauthorized');
    }
}
