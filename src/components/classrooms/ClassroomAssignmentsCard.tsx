
import { AssignedTestType } from "@/types/test/AssignedTestType";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { useUser } from "../context/userWrapper";
import AssignmentCard from "./AssignmentCard";
import AssignmentDialog from "./AssignmentDialog";
import { Card } from "../ui/card";

export default function ClassroomAssignmentsCard({ 
    testList,
    availableTests,
    classroomId,
    onAssign,
    onDelete,
}: {
    testList: AssignedTestType[],
    availableTests: TestTemplateType[],
    classroomId: number,
    onAssign?: (newAssignment: AssignedTestType) => void,
    onDelete: (assignmentId: number) => void,
}) {
    const user = useUser();

    return (
        <Card className="flex flex-col gap-3 p-6 shadow-none border-none rounded-none">
            {
                user.role === 'teacher' &&
                <AssignmentDialog 
                    type="create"
                    classroomId={classroomId}
                    availableTests={availableTests}
                    onAssign={onAssign}
                />
            }
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
