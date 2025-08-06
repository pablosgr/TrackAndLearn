
import { AssignedTestType } from "@/types/test/AssignedTestType";
import AssignmentCard from "./AssignmentCard";
import { Card } from "../ui/card";

export default function ClassroomAssignmentsCard({ 
    testList,
    onDelete,
}: {
    testList: AssignedTestType[],
    onDelete: (assignmentId: number) => void,
}) {
    return (
        <Card className="flex flex-col gap-3 p-6 shadow-none border-none rounded-none">
            {
                testList.map((test) => (
                    <AssignmentCard 
                        key={test.id}
                        test={test}
                        onDelete={onDelete}
                    />
                ))
            }
        </Card>
    )
}
