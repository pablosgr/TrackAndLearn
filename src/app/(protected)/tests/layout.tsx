import { ReactNode } from "react";
import { redirect } from "next/navigation";
import hasRole from "@/utils/auth/hasRole";

export default async function TestLayout({ children }: { children: ReactNode }) {
    const isAuthorized = await hasRole(['teacher']);

    if (!isAuthorized) {
        redirect('/unauthorized');
    }

    return (
        <>
            { children }
        </>
    )
}
