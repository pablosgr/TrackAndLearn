import { Separator } from "@/components/ui/separator";

export default function NotFound() {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="h-15 flex flex-row gap-5 items-center">
                <p className="text-3xl font-bold">404</p>
                <Separator orientation="vertical" className="bg-gray-300" />
                <p className="text-xl">Page not found</p>
            </div>
        </div>
    )
}
