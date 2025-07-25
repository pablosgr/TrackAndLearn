import requireUser from "./requireUser";

export default async function hasRole(allowedRoles: string[]): Promise<boolean> {
    const user = await requireUser();

    if (!user || !allowedRoles.includes(user.role)) {
        return false;
    }

    return true;
}
