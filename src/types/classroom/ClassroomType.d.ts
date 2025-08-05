export type ClassroomType = {
    id: number;
    teacher_id: number;
    name: string;
    code: string;
    created_at: string;
    teacher?: {
        name: string;
    }
}
