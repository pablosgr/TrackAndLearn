import { useUser } from "../context/userWrapper";
import ProfileAvatar from "./ProfileAvatar";
import { Button } from "../ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function ProfileCard() {
    const {user} = useUser();
    const userInfo = [
        {label: 'Name', value: user.name},
        {label: 'Username', value: user.username},
        {label: 'Email', value: user.email},
        {label: 'Role', value: user.role}
    ];

    return (
        <Card className="w-full h-full md:w-[80%]">
            <CardContent className="pt-12 px-12 flex flex-col xl:flex-row gap-20">
                <section className="flex flex-col items-center gap-8">
                    <ProfileAvatar name={user.name} size={13} />
                    <p className="text-2xl font-semibold">{user.name}</p>
                    <span className="text-foreground-card text-sm">
                        Joined on {new Date(user.created_at).toLocaleDateString()}
                    </span>
                </section>
                <section className="flex-1 flex flex-col gap-8 text-md">
                    {
                        userInfo.map((item, index)=> (
                            <div key={index}>
                                <p className="pb-5 border-b-1 border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <span className="font-bold">{item.label}</span>
                                    <span className="truncate">{item.value}</span>
                                </p>
                            </div>
                        ))
                    }
                </section>
            </CardContent>
        </Card>
    )
}
