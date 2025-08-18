import { AssignedTestType } from "@/types/test/AssignedTestType";
import { useUser } from "../context/userWrapper";
import { useRouter } from "next/navigation";
import { updateResultVisibility } from "@/app/(protected)/classrooms/actions/update";
import { removeAssignment } from "@/app/(protected)/classrooms/actions/delete";
import CustomAlertDialog from "../CustomAlertDialog";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AssignmentCard({
    test,
    onDelete,
    onResult
}: {
    test: AssignedTestType,
    onDelete: (assignmentId: number) => void,
    onResult: (assignmentId: number, visible: boolean) => void
}) {
    const {user} = useUser();
    const router = useRouter();

    const handleRemoveAssignment = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(test.id);
        await removeAssignment(test.id);
        router.refresh();
    }

    const handleResultVisibility = async (checked: boolean) => {
        onResult(test.id, checked);
        await updateResultVisibility(test.id, checked);
        router.refresh();
    }

    return (
        <Card
            className={`
                flex flex-col gap-0 border-gray-300
                shadow-none hover:shadow-(--shadow-sm) transition-shadow
            `}
        >
            <CardHeader>
                <CardTitle>{test.test_template.name}</CardTitle>
                {
                    user.role === 'teacher' &&
                    <CustomAlertDialog
                        description="Assignment will be removed from classroom."
                        onDelete={handleRemoveAssignment}
                    />
                }
            </CardHeader>
            <CardContent className="flex flex-row gap-6 items-center justify-between">
                {
                    user.role === 'teacher'
                    ?    <div className="flex items-center gap-2">
                            <Switch 
                                id={`${test.id}-result`}
                                checked={test.is_result_visible}
                                onCheckedChange={handleResultVisibility}
                            />
                            <Label htmlFor={`${test.id}-result`}>Show results</Label>
                        </div>
                    :   <span></span>
                }
                {
                    (user.role === 'teacher' || (user.role === 'student' && test.has_result && test.is_result_visible)) && (
                        <Link href={`/classrooms/${test.classroom_id}/test/${test.test_template_id}/result`}>
                            <Button variant="outline">
                                {user.role === 'teacher' ? 'Check Results' : 'Check Result'}
                            </Button>
                        </Link>
                    )
                }
                {
                    user.role === 'student' && !test.has_result && (
                        <Link href={`/classrooms/${test.classroom_id}/test/${test.test_template_id}`}>
                            <Button>Take Test</Button>
                        </Link>
                    )
                }
                {
                    user.role === 'student' && test.has_result && !test.is_result_visible && (
                        <Button disabled>Test already done</Button>
                    )
                }
            </CardContent>
        </Card>
    )
}
