export type TestResponseType = {
    id: number;
    test_result_id: number;
    question_id: number;
    selected_option_id: number | null;
    is_correct: boolean;
};
