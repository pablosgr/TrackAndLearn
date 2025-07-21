import { getClassroomsByRole } from "./actions";
import requireUser from "@/utils/auth/requireUser";
import ClassroomsPageClient from "./ClassroomsPageClient";

export default async function TestsPage() {
    const user = await requireUser();
    const classrooms = await getClassroomsByRole(user?.id, user?.role);

    return (
        <ClassroomsPageClient data={classrooms}/>
    )
}
