import { OptionType } from "./OptionType";

export type NewQuestionType = {
    test_id: number;
    question_text: string;
    options_number: number;
    index_order: number | null;
}

export type QuestionType = NewQuestionType & {
    id: number;
    option: OptionType[];
}
