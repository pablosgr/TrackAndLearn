import { OptionType } from "./OptionType";

export type QuestionType = {
    id: number;
    question_text: string;
    options_number: number;
    index_order: number;
    option: OptionType[];
};
