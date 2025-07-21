import TestTemplateType from "./TestTemplateType";

export type AssignedTestType = {
    classroom_id: number;
    test_template_id: number;
    assigned_at: string;
    due_date: string;
    test_template: TestTemplateType;
}
