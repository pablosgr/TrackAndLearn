import { QuestionType } from "./QuestionType";

export type TestTemplateRef = {
    teacher_id: number;
};

export type TestType = {
    id: number;
    template_id: number,
    name: string;
    level: string | null;
    time_limit: number | null;
    adaptation_id: number | null;
    created_at: string;
    test_template: TestTemplateRef | null;
    question: QuestionType[];
};
