'use client';

import { LayoutDashboard, BookOpenText, School, UserRound, LogOut, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { signOut } from "@/app/actions";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
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
    },
    {
        title: "About",
        url: "/about",
        icon: Info
    }
]

export default function AppSidebar() {
    const pathname = usePathname();
    const {user} = useUser();

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="group-data-[collapsible=icon]:hidden flex items-start pl-4 pt-4">
                <Image src={'/logo-b.png'} alt="Track & Learn Logo" width={110} height={50}/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-3">
                            {items.map((item) => {
                                const isActive = pathname.includes(item.url);

                                if (item.title === 'Tests' && user.role != 'teacher') {
                                    return null;
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className='[&>svg]:size-6 py-6 gap-4 transition-colors'
                                        >
                                            <Link href={item.url}>
                                                <item.icon
                                                    strokeWidth={`${isActive ? 2.3 : 1.7}`}
                                                />
                                                <span className={`${ isActive ? 'font-bold' : '' } text-[15px]`}>{item.title}</span>
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
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={handleSignOut}
                                    className="hover:cursor-pointer [&>svg]:size-6 py-5 gap-4 transition-colors"
                                >
                                    <LogOut />
                                    <span>Sign out</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}
