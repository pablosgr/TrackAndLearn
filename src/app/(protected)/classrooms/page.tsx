import { getClassroomsByRole } from "./actions";
import requireUser from "@/utils/auth/requireUser";
import ClassroomsPageClient from "./ClassroomsPageClient";

export default async function ClassroomsPage() {
    const user = await requireUser();
    const classrooms = await getClassroomsByRole(user?.id, user?.role, [0, 5]);

    return (
        <ClassroomsPageClient data={classrooms}/>
    )
}
