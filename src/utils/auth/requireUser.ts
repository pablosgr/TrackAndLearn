import { createClient } from "../supabase/server";
import { UserContextType } from "@/types/context/UserContextType";

export default async function requireUser(): Promise<UserContextType>  {
    const supabase = await createClient();
    
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userData.user?.id)
        .single();

    if (error) {
        console.error('Error retrieving user data: ', error);
    }

    return data;
}
