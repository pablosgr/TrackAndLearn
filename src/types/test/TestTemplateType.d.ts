export type NewTestTemplateType = {
    name: string;
    teacher_id: string;
    topic_id: string;
}

export type TestTemplateType = NewTestTemplateType & {
    id: string;
    created_at: string;
    topic_data: {
        name: string;
    };
}
