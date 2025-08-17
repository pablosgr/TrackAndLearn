import { ReactNode } from "react";
import { redirect } from "next/navigation";
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
        redirect('/unauthorized');
    }

    const isOwner = await verifyClassroomOwnership(user?.id, classroomId);

    if (user?.role === 'teacher' && !isOwner) {
        redirect('/unauthorized');
    }

    return (
        <>
            { children }
        </>
    )
}
