'use client'

import { useUser } from "@/components/userWrapper";
import { TestType } from "@/types/test/TestType";

export default function StudentTestClient({ data }: { data: TestType[] }) {
    const user = useUser();

    const visibleTest = data.find(t => t.adaptation_id === user.adaptation_id) ?? data[0];

    if (!visibleTest) {
        return <div>Test not found</div>
    }

    
    return (
        <div className="flex flex-col gap-3 p-10">
            {
                <section className="p-10 m-10 shadow-xl rounded-lg bg-amber-200/50">
                    <h2>{visibleTest.name}</h2>
                    <p>{visibleTest.level}</p>
                    {
                        visibleTest.adaptation_id && <p>Adaptation {visibleTest.adaptation_id}</p>
                    }
                    <section>
                        <ul className="flex flex-col gap-8">
                            {
                                visibleTest.question.map((q) => (
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
                </section>
            }
        </div>
    )
}
