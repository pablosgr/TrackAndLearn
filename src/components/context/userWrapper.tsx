'use client'

import { createContext, ReactNode, useState, useContext } from "react";
import { UserContextType, UserContextValue } from "@/types/context/UserContextType";

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserWrapper({  
    user: initialUser,
    children
}: {
    user: UserContextType,
    children: ReactNode
}) {
    const [user, setUser] = useState<UserContextType>(initialUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used inside <UserWrapper>');

    return context
}
