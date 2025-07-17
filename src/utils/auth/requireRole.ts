import { redirect } from "next/navigation";
import requireUser from "./requireUser";

export default async function requireRole(allowedRoles: string[]) {
    const user = await requireUser();

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/unauthorized');
    }
}
