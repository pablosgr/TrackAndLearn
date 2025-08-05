export type RawSupabaseClassroomType = {
    id: number;
    teacher_id: number;
    name: string;
    code: string;
    created_at: string;
    teacher?: {
        name: string;
    }[];
}

export type RawClassroomType = {
    classroom: RawSupabaseClassroomType[];
}
