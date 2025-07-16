
import Link from "next/link";

export default function Unauthorized() {
    return (
        <div className="flex flex-col gap-10">
            <p>You don't have permission to view this page</p>
            <Link href='/dashboard' className="py-3 px-6 w-fit bg-cyan-500 text-white rounded-lg hover:cursor-pointer hover:bg-cyan-600 transition-colors">Return to Dashboard</Link>
        </div>
    )
}
