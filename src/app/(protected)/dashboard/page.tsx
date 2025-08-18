'use client'

import { signOut } from "../../actions";
import { useUser } from "@/components/context/userWrapper";

export default function Dashboard() {
    const {user} = useUser();

    const handleSignOut = async () => {
        await signOut();
    }

  return (
    <div className="flex flex-row p-10 gap-6">
        <p>Hello, {user.username}</p>
    </div>
  )
}
