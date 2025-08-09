export type NewTestResponseType = {
    test_result_id: number;
    question_id: number;
    selected_option_id: number | null;
    is_correct: boolean;
}

export type TestResponseType = NewTestResponseType & {
    id: number;
};
