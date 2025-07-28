'use client'

import { signOut } from "../../actions";
import { useUser } from "@/components/context/userWrapper";

export default function Dashboard() {
    const userData = useUser();

    const handleSignOut = async () => {
        await signOut();
    }

  return (
    <div className="flex flex-row p-10 gap-6">
        <p>Hello, {userData.username}</p>
    </div>
  )
}
