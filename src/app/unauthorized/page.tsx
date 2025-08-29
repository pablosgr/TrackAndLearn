import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Unauthorized() {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="h-20 flex flex-row gap-5 items-center">
                <p className="text-xl">You don&apos;t have permission to view this page</p>
                <Separator orientation="vertical" className="bg-gray-300" />
                <Link href='/dashboard'>
                    <Button className="py-6 px-6 text-md">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    )
}
