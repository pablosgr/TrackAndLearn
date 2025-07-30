import { TestType } from "@/types/test/TestType";
import TestTemplateType from "@/types/test/TestTemplateType";

export default async function TestDetailClient({ 
    testList,
    testTemplate
}: { 
    testList: TestType[],
    testTemplate: TestTemplateType
}) {

    return (
        <div className="flex flex-col gap-5 p-10 m-10 shadow-xl rounded-lg bg-amber-200/50">
            {
                testList && testList.map((test) => (
                    <section key={test.id} className="p-5 bg-emerald-300 rounded-lg">
                        <h2>{test.name}</h2>
                        <p>{test.level}</p>
                        {
                            test.adaptation_data && <p>Adaptation: {test.adaptation_data.name}</p>
                        }
                        <ul className="flex flex-col gap-8 mt-8">
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
                ))
            }
        </div>
    );
}
