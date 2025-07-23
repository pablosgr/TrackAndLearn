import { ReactNode } from "react";
import { verifyEnrollment } from "../actions";
import requireUser from "@/utils/auth/requireUser";

export default async function ClassroomLayout(
{ 
        children,
        params 
}: {
    children: ReactNode,
    params: { id: string }
}) {
    const data = await params;
    const user = await requireUser();
    const classroomId = Number(data.id);
    
    const isEnrolled = await verifyEnrollment(user?.id, classroomId);
    
    if (!isEnrolled) {
        return (
            <div>You are not enrolled in this classroom</div>
        )
    }

    return (
        <>
            { children }
        </>
    )
}
