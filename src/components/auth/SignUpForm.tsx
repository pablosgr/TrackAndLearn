import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signUp } from "@/app/actions";
import PasswordInput from "../profile/PasswordInput";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }).max(150),
  username: z.string().min(2, { message: "Username is required" }).max(10),
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must have at least 8 characters" }),
  role: z.string().min(1, { message: 'Choose a role' })
});

export default function SignUpForm() {
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            role: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        setError(null);
        try {
            await signUp(values);
        } catch (e: any) {
            if (e instanceof Error && e.message !== "NEXT_REDIRECT") {
                setError(e.message);
            }
        }
    };

    return (
        <Card className="w-[25%] min-w-70 h-fit p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Name"
                                        className="py-5"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        className="py-5"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        className="py-5"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <PasswordInput
                        form={form}
                        type="auth"
                        name="password"
                        placeholder="Password"
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full py-5">
                                            <SelectValue placeholder="Choose your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectItem value="teacher">I'm a teacher</SelectItem>
                                            <SelectItem value="student">I'm a student</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p className="text-red-500 truncate">
                        {error && error}
                    </p>
                    <Button type="submit" className="w-full h-11 mt-4 text-md">
                        Sign Up
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
