export type StudentType = {
    id: number;
    name: string;
    username: string;
    email: string;
    adaptation_id: number | null;
    adaptation_data: {
        name: string;
        code: string;
    } | null;
}
