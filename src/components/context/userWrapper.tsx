'use client'

import { createContext, ReactNode, useContext } from "react";
import { UserContextType } from "@/types/context/UserContextType";

const UserContext = createContext<UserContextType | null>(null);

export function UserWrapper({  
    user,
    children 
}: {
    user: UserContextType | null,
    children: ReactNode
}) {
    return (
        <UserContext.Provider value={user}>
            { children }
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used inside <UserWrapper>');

    return context
}
