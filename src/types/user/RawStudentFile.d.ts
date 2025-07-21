export type RawSupabaseStudentType = {
    id: number;
    name: string;
    username: string;
    email: string;
    adaptation_id: number;
}

export type RawStudentType = {
    student: RawSupabaseStudentType[];
}
