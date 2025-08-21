import { ClassroomResultType } from "@/types/test/ClassroomResultType";
import StudentsAnswersCard from "./StudentsAnswersCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function StudentsResultAccordion({
    classroomResults
}: { 
    classroomResults: ClassroomResultType[]
}) {
    return (
        <Accordion
            type="multiple"
        >
            {
                classroomResults.map((item) => {
                    const startTime = new Date(item.started_at).getTime();
                    const endTime = new Date(item.ended_at).getTime();

                    const diff = endTime - startTime;
                    const takenTime = Math.floor(diff / 1000 / 60);

                    return (
                        <AccordionItem key={item.id} value={`result-${item.id}`}>
                            <AccordionTrigger 
                                className={`
                                    p-5 border-b-1 rounded-none border-gray-400
                                    hover:cursor-pointer hover:bg-secondary/20
                                    dark:hover:bg-primary/20
                                `}
                            >
                                <div>{item.student_data.name}</div>
                                <div>{item.student_data.username}</div>
                                <div className="flex flex-row gap-3 items-center">
                                    <div 
                                        className={`
                                            rounded-full w-4 h-4
                                            ${item.score < 5 && 'bg-chart-r'}
                                            ${item.score >= 5 && item.score < 7 ? 'bg-chart-y' : ''}
                                            ${item.score >= 7 && 'bg-chart-g'}
                                        `}
                                    ></div>
                                    Score: {item.score}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-5 flex flex-row gap-15">
                                <section className="w-fit flex flex-col gap-5">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-semibold">Time used</h3>
                                        <p>{takenTime} minute/s</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-semibold">Adaptation</h3>
                                        <p>
                                            {
                                                item.test_data.test_adaptation
                                                ? item.test_data.test_adaptation.code
                                                : 'None'
                                            }
                                        </p>
                                    </div>
                                </section>
                                <section className="flex-1 flex flex-col gap-3">
                                    <h3 className="font-semibold">Answers</h3>
                                    <div className="flex flex-row gap-5">
                                        <article className="flex-1">
                                            <StudentsAnswersCard 
                                                type="correct"
                                                questions={item.test_data.question}
                                                studentResponses={item.response}
                                            />
                                        </article>
                                        <article className="flex-1">
                                            <StudentsAnswersCard 
                                                type="incorrect"
                                                questions={item.test_data.question}
                                                studentResponses={item.response}
                                            />
                                        </article>
                                    </div>
                                </section>

                            </AccordionContent>
                        </AccordionItem>
                    )
                })
            }
        </Accordion>
    )
}