export type UserType = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    auth_id: string;
    adaptation_id: number | null;
    created_at: string;
}
