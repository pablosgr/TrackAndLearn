import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SearchBar(
{
    onSearch,
}: {
    onSearch: (value: string) => void
}
) {
    return (
        <div className="relative w-full">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`
                    absolute left-0 top-0 h-full px-3
                    hover:bg-transparent dark:hover:bg-transparent
                `}
            >
                <Search />
            </Button>
            <Input
                type="text"
                placeholder="Search by name"
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 shadow-none dark:bg-transparent"
            />
        </div>
    )
}
