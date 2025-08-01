export type EditQuestionType = {
    question_text: string;
    options_number: number;
    options: {
        id: number | null;
        option_text: string;
        is_correct: boolean;
        index_order: number | null;
    }[];
};
