'use client'

import { useUser } from "@/components/userWrapper";

export default function Profile() {
    const user = useUser();

    return (
        <div>
            <h2>Your user information</h2>
            <p>Name: {user.name}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    )
}
