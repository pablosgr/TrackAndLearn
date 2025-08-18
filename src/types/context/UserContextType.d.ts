export type UserContextType = {
    id: string;
    name: string;
    username: string;
    role: string;
    email: string;
    auth_id: string;
    created_at: string;
}

export type UserContextValue = {
    user: UserContextType;
    setUser: (user: UserContextType) => void;
}
