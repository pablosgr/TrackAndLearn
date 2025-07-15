'use client'

import { useEffect, useState } from "react";
import { signOut } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data, error }) => {
            if (error || !data?.user) {
                window.location.href = '/';
            } else {
                setUser(data.user);
            }
        });
    }, []);

    const handleSignOut = async () => {
        const result = await signOut();
    }

  return (
    <div className="fles flex-row p-10 gap-12">
        <p>Hello {user?.email}</p>
        <button onClick={handleSignOut} className="p-4 rounded-lg bg-amber-700/50 hover:cursor-pointer hover:bg-amber-600/50 text-white transition-colors">Sign Out</button>
    </div>
  )
}
