import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export default function PasswordInput<TFormValues extends FieldValues>(
{ 
    control,
    type,
    name,
    label,
    placeholder
}: {
    control: Control<TFormValues>,
    type: 'reset' | 'auth',
    name: Path<TFormValues>,
    label?: string,
    placeholder: string
}) {
    const [isvisible, setIsVisible] = useState<boolean>(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {
                        label && (
                            <FormLabel asChild>
                                <span>{label}</span>
                            </FormLabel>
                        )
                    }
                    <FormControl>
                        <div className="relative w-full">
                            <Input
                                type={`${isvisible ? 'text' : 'password'}`}
                                placeholder={placeholder}
                                className={`${type === 'auth' && 'py-5'}`}
                                {...field}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsVisible((prev) => !prev)}
                                className={`
                                    absolute right-0 top-0 h-full px-3
                                    hover:bg-transparent dark:hover:bg-transparent
                                `}
                            >
                                {
                                    isvisible
                                    ? <EyeOff className="text-gray-400"/> 
                                    : <Eye className="text-gray-400"/>
                                }
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
