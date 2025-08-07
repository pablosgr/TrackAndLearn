
import { AssignedTestType } from "@/types/test/AssignedTestType";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { useUser } from "../context/userWrapper";
import AssignmentCard from "./AssignmentCard";
import AssignmentDialog from "./AssignmentDialog";
import { Card } from "../ui/card";

export default function ClassroomAssignmentsCard({ 
    assignedTests,
    availableTests,
    classroomId,
    onAssign,
    onDelete,
    onResult
}: {
    assignedTests: AssignedTestType[],
    availableTests: TestTemplateType[],
    classroomId: number,
    onAssign?: (newAssignment: AssignedTestType) => void,
    onDelete: (assignmentId: number) => void,
    onResult: (assignmentId: number, visible: boolean) => void
}) {
    const user = useUser();
    const assignments = assignedTests.length > 0;

    return (
        <Card 
            className={
                `flex p-6
                ${assignments ? 'flex-col gap-4' : 'h-full items-center justify-center'}
                shadow-none border-none rounded-none
            `}
        >
            {
                !assignments && (
                    <span className="text-gray-400 text-lg">
                        No tests assigned yet..
                    </span>
                )
            }
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
                assignedTests.map((test) => (
                    <AssignmentCard 
                        key={test.id}
                        test={test}
                        onDelete={onDelete}
                        onResult={onResult}
                    />
                ))
            }
        </Card>
    )
}
