import StudentsResultAccordion from "@/components/classrooms/StudentsResultAccordion";
import AverageScoreCard from "@/components/classrooms/AverageScoreCard";
import QuestionsResultsCard from "@/components/classrooms/QuestionsResultsCard";
import { organizeResultsByAdaptation } from "@/utils/tests/organizeResultsByAdaptation";
import { ClassroomResultType } from "@/types/test/ClassroomResultType";

export default function ClassroomResultClient({ classroomResults }: { classroomResults: ClassroomResultType[] }) {
    if (classroomResults.length === 0) {
        return (
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                <h2 className="text-2xl">No results registered yet</h2>
                <p className="text-lg">Come back when a student completes the test</p>
            </div>
        )
    }

    const organizedResults = organizeResultsByAdaptation(classroomResults);

    return (
        <div className="flex flex-col gap-17 w-full">
            <section className="w-full flex flex-col gap-10">
                <h2 className="text-3xl font-bold">Classroom result</h2>
                <AverageScoreCard classroomResults={classroomResults} />
                <QuestionsResultsCard classroomResults={organizedResults.find(([id]) => id === 0)?.[1] ?? []} />
                {
                    organizedResults.map((res, index) => {
                        return res[0] !== 0 &&
                        <QuestionsResultsCard key={index} classroomResults={res[1]} />
                    })
                }
            </section>
            <section className="w-full flex flex-col gap-3">
                <h2 className="text-3xl font-bold mb-5">Individual results</h2>
                <StudentsResultAccordion classroomResults={classroomResults} />
            </section>
        </div>
    )
}
