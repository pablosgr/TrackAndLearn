
import { createClient } from "@/utils/supabase/server";
import requireUser from "@/utils/auth/requireUser";

export default async function TestDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const supabase = await createClient();
    const userData = await requireUser();

    const { data: test, error } = await supabase
        .from('test')
        .select('id, name, level, template_id, test_template: test_template_id (teacher_id)')
        .eq('id', data.id)
        .single();

    if (!test) {
        return <p>Not found</p>;
    }

    const isAuthor = userData?.id === test.test_template?.teacher_id;

    if (!isAuthor) {
        return (
            <p>You are not the author</p>
        )
    }

    return (
        <div>
            <h2>{test.name}</h2>
            <p>{test.level}</p>
        </div>
    );
}
