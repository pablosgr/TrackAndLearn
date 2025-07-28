'use client'

import { LayoutDashboard, BookOpenText, School, UserRound, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { signOut } from "@/app/actions";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Tests",
        url: "/tests",
        icon: BookOpenText,
    },
    {
        title: "Classrooms",
        url: "/classrooms",
        icon: School,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: UserRound,
    }
]

export default function AppSidebar() {
    const pathname = usePathname();
    const user = useUser();

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">Track & Learn</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname.includes(item.url);

                                if (item.title === 'Tests' && user.role != 'teacher') {
                                    return null;
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span className={`${ isActive ? 'font-bold' : '' }`}>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleSignOut}>
                                    <LogOut />
                                    <span>Log out</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}
