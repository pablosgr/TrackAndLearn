import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DateSortSelect(
{
    onSort,
}: {
    onSort: (value: string) => void
}
) {
    return (
        <Select onValueChange={onSort}>
            <SelectTrigger
                className={`
                    w-33 text-foreground
                    shadow-none hover:cursor-pointer
                    dark:bg-transparent dark:hover:bg-transparent
                `}
            >
                <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
        </Select>
    )
}
