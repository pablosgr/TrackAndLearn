import { ReactNode } from "react";
import { UserWrapper } from "@/components/userWrapper";
import Link from "next/link";
import requireUser from "@/utils/auth/requireUser";

export default async function MainLayout({ children }: { children: ReactNode }) {
    const user = await requireUser();

    return (
        <UserWrapper user={user}>
            <ul className="flex flex-row gap-8 bg-cyan-400 p-8">
                <Link href={'/dashboard'}>Dashboard</Link>
                <Link href={'/tests'}>Tests</Link>
                <Link href={'/classrooms'}>Classrooms</Link>
                <Link href={'/profile'}>Profile</Link>
            </ul>
            { children }
        </UserWrapper>
    )
}
