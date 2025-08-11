import StudentsResultAccordion from "@/components/classrooms/StudentsResultAccordion";
import { ClassroomResultType } from "@/types/test/ClassroomResultType";

export default function ClassroomResultClient({ classroomResults }: { classroomResults: ClassroomResultType[] }) {
    return (
        <>
            <h1>Results</h1>
            <section className="w-full flex">
                <h2 className="text-xl mb-5">Classroom result</h2>
            </section>
            <section className="w-full flex flex-col gap-3">
                <h2 className="text-xl mb-5">Individual results</h2>
                <StudentsResultAccordion classroomResults={classroomResults} />
            </section>
        </>
    )
}
