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
                <div className="w-full flex flex-col sm:flex-row">
                    <div className="w-fit h-fit p-2.5 sticky top-0">
                        <SidebarTrigger />
                    </div>
                    <main className="pb-5 sm:py-14 px-5 sm:px-[8%] flex-1 flex flex-col items-center">
                        { children }
                    </main>
                </div>
            </SidebarProvider>
        </UserWrapper>
    )
}
