'use client'

import { useUser } from "@/components/userWrapper"

export default function Tests() {
    const userData = useUser();

    return (
        <div className="flex flex-row justify-items-center">
            <p>Welcome, {userData.name}. You are in tests page now</p>
        </div>
    )
}
