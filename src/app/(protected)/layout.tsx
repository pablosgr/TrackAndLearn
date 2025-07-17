import { ReactNode } from "react";
import { UserWrapper } from "@/components/userWrapper";
import requireUser from "@/utils/auth/requireUser";

export default async function MainLayout({ children }: { children: ReactNode }) {
    const user = await requireUser();

    return (
        <UserWrapper user={user}>
            { children }
        </UserWrapper>
    )
}
