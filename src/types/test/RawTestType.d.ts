export type RawTestResponse = {
    id: number;
    template_id: number;
    name: string;
    level: string | null;
    time_limit: number | null;
    adaptation_id: number | null;
    created_at: string;
    test_template: {
        teacher_id: number;
    }[];
    question: {
        id: number;
        question_text: string;
        options_number: number;
        index_order: number;
        option: {
            id: number;
            option_text: string;
            is_correct: boolean;
            index_order: number;
        }[];
    }[];
};
