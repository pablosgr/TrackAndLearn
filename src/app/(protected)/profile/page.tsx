'use client'

import { useUser } from "@/components/context/userWrapper";
import ProfileCard from "@/components/profile/ProfileCard";

export default function Profile() {
    const {user, setUser} = useUser();

    return (
        <>
        <header className="pb-10 w-full">
            <h1 className="text-3xl font-bold self-start">My Profile</h1>
        </header>
        <ProfileCard />
        </>
    )
}
