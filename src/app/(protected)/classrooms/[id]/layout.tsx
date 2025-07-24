import { ReactNode } from "react";
import { verifyClassroomEnrollment, verifyClassroomOwnership } from "../actions";
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
    
    const isEnrolled = await verifyClassroomEnrollment(user?.id, classroomId);
    
    if (user?.role === 'student' && !isEnrolled) {
        return (
            <p>You are not enrolled in this classroom</p>
        )
    }

    const isOwner = await verifyClassroomOwnership(user?.id, classroomId);

    if (user?.role === 'teacher' && !isOwner) {
        return (
            <p>You are not the owner of the classroom</p>
        )
    }

    return (
        <>
            { children }
        </>
    )
}
