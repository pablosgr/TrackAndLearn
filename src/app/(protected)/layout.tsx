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
                <main>
                    <SidebarTrigger className="ml-3 mt-3"/>
                    { children }
                </main>
            </SidebarProvider>
        </UserWrapper>
    )
}
