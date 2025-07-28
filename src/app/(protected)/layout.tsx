import { ReactNode } from "react";
import { UserWrapper } from "@/components/context/userWrapper";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import requireUser from "@/utils/auth/requireUser";

export default async function MainLayout({ children }: { children: ReactNode }) {
    const user = await requireUser();

    return (
        <UserWrapper user={user}>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-fit p-2.5">
                    <SidebarTrigger />
                </div>
                <main className="py-14 pr-10 w-screen">
                    { children }
                </main>
            </SidebarProvider>
        </UserWrapper>
    )
}
