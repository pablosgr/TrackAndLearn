import TestTemplateType from "./TestTemplateType";

export type AssignedTestType = {
    id: number;
    classroom_id: number;
    test_template_id: number;
    assigned_at: string;
    due_date: string;
    test_template: TestTemplateType;
    has_result: boolean;
    is_result_visible: boolean;
}
