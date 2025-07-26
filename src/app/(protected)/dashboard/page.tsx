'use client'

import { signOut } from "../../actions";
import { useUser } from "@/components/userWrapper";

export default function Dashboard() {
    const userData = useUser();

    const handleSignOut = async () => {
        await signOut();
    }

  return (
    <div className="flex flex-row p-10 gap-6">
        <p>Hello, {userData.username}</p>
        <button onClick={handleSignOut} className="p-4 rounded-lg bg-amber-700/50 hover:cursor-pointer hover:bg-amber-600/50 text-white transition-colors">Sign Out</button>
    </div>
  )
}
