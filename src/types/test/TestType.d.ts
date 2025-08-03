import { QuestionType } from "./QuestionType";

export type NewTestType = {
    id: number;
    template_id: number,
    name: string;
    level: string | null;
    time_limit: number | null;
    adaptation_id: number | null;
}

export type TestTemplateRef = {
    teacher_id: number;
};

export type TestType = NewTestType & {
    created_at: string;
    test_template: TestTemplateRef | null;
    question: QuestionType[];
    adaptation_data: {
        name: string;
        code: string;
    } | null;
};
