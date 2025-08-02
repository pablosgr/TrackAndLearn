export type NewOptionType = {
    option_text: string;
    is_correct: boolean;
    index_order: number | null;
}

export type OptionType = NewOptionType & {
    id: number;
    question_id: number;
};
