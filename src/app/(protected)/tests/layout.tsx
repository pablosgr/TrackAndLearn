import { ReactNode } from "react";
import requireRole from "@/utils/auth/requireRole";

export default async function TestLayout({ children }: { children: ReactNode }) {
    await requireRole(['teacher']);

    return (
        <>
            { children }
        </>
    )
}
