import requireUser from "@/utils/auth/requireUser";
import { TestType } from "@/types/test/TestType";

export default async function TestDetailClient({ test }: { test: TestType | null }) {
    const userData = await requireUser();

    if (!test) {
        return <p>Test not found</p>
    }

    const isAuthor = userData?.id === test.test_template?.teacher_id;

    if (!isAuthor) {
        return (
            <p>You are not the author of this test</p>
        )
    }

    return (
        <div className="flex flex-col gap-5 p-10 m-10 shadow-xl rounded-lg bg-amber-200/50">
            <h2>{test.name}</h2>
            <p>{test.level}</p>
            <section>
                <ul className="flex flex-col gap-8">
                    {
                        test.question.map((q) => (
                            <li key={q.id} className="p-5 bg-white rounded-xl">
                                <p className="font-semibold">{q.question_text}</p>
                                {
                                    q.option.map((o) => (
                                        <p key={o.id} className={`ml-4 ${o.is_correct && 'text-green-500'}`}>
                                            {o.option_text}
                                        </p>
                                    ))
                                }
                            </li>
                        ))
                    }
                </ul>
            </section>
        </div>
    );
}
