import { EditOptionType } from "./EditOptionType";

export type EditQuestionType = {
    test_id: number;
    question_text: string;
    options_number: number;
    options: EditOptionType[];
};
