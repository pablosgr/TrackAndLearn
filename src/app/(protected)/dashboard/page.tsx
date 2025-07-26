'use client'

import { signOut } from "../../actions";
import { useUser } from "@/components/userWrapper";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Dashboard() {
    const userData = useUser();

    const handleSignOut = async () => {
        await signOut();
    }

  return (
    <div className="flex flex-row p-10 gap-6">
        <p>Hello, {userData.username}</p>
        <Button onClick={handleSignOut} variant={'outline'} className="w-40 h-15">
          <LogOut />
          Log out
        </Button>
    </div>
  )
}
