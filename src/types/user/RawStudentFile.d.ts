export type RawSupabaseStudentType = {
    id: number;
    name: string;
    username: string;
    email: string;
}

export type RawDBStudentType = {
    student: RawSupabaseStudentType[];
    adaptation_id: number;
    adaptation_data: {
        name: string;
        code: string;
    }[]
}

export type RawStudentType = {
    student: RawSupabaseStudentType;
    adaptation_id: number | null;
    adaptation_data: {
        name: string;
        code: string;
    } | null
}
