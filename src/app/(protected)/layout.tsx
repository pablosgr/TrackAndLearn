import { ReactNode } from "react";
import { UserWrapper } from "@/components/context/userWrapper";
import ThemeToggle from "@/components/sidebar/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import requireUser from "@/utils/auth/requireUser";

export default async function MainLayout({ children }: { children: ReactNode }) {
    const user = await requireUser();

    return (
        <UserWrapper user={user}>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <div className="w-full min-h-screen flex flex-col sm:flex-row">
                    <div className="w-fit h-fit p-2.5 pt-2 sticky top-0 flex flex-col gap-3">
                        <SidebarTrigger className="hover:bg-secondary dark:hover:bg-accent hover:text-white"/>
                        <ThemeToggle />
                    </div>
                    <main className="pb-5 sm:py-14 px-5 sm:pr-[4%] flex-1 flex flex-col items-center">
                        { children }
                    </main>
                </div>
            </SidebarProvider>
        </UserWrapper>
    )
}
