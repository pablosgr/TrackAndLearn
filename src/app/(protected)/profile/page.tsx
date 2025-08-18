'use client'

import { useUser } from "@/components/context/userWrapper";
import ProfileCard from "@/components/profile/ProfileCard";

export default function Profile() {
    const {user, setUser} = useUser();

    return (
        <>
            <h1 className="text-3xl font-bold self-start pb-10">My Profile</h1>
            <ProfileCard />
        </>
    )
}
