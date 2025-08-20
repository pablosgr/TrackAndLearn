import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "@/app/actions";
import PasswordInput from "../profile/PasswordInput";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string().min(1, { message: 'Password cannot be empty' })
});

export default function SignInForm() {
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null);

        try {
            await signIn(values);
        } catch (e: any) {
            if (e instanceof Error && e.message !== 'NEXT_REDIRECT') {
                setError(e.message);
            }
        }
    }

    return (
        <Card className="w-[20%] min-w-65 h-fit p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                    <p className="text-chart-r max-w-40 truncate">
                        {
                            error && error
                        }
                    </p>
                    <div className="flex flex-row gap-3">
                        <Button type="submit" className="w-full h-11 mt-4 text-md">
                            Sign In
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
}
