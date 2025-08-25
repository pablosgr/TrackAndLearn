import { ClassroomResultType } from "@/types/test/ClassroomResultType";

export function organizeResultsByAdaptation(classroomResults: ClassroomResultType[]): [number, ClassroomResultType[]][] {
    const existingAdaptations: number[] = [];
    const organizedResults: [number, ClassroomResultType[]][] = [];

    classroomResults.forEach((res) =>{
        const adaptationId = res.test_data.adaptation_id ?? 0;

        if (adaptationId && !existingAdaptations.includes(adaptationId)) {
            existingAdaptations.push(adaptationId);
        }
    });

    const notAdapted = classroomResults.filter((res) => res.test_data.adaptation_id === null);
    organizedResults.push([0, notAdapted]);

    existingAdaptations.forEach((adp) => {
        const adaptedResults = classroomResults.filter((res) => res.test_data.adaptation_id === adp);
        organizedResults.push([adp, adaptedResults]);
    });

    return organizedResults;
}
