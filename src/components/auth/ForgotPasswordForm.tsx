'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOTP, validateEmail } from "@/app/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { showToast } from "@/utils/general/showToast";

const formSchema = z.object({
    email: z.email("Invalid email format"),
});


export default function ForgotPasswordForm(
{
        emailUpdate
}: {
        emailUpdate: (newEmail: string) => void
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await validateEmail(values.email);
            await sendOTP(values.email);
            emailUpdate(values.email);
            showToast("We sent you a code. Please check your email", "success");
        } catch (e) {
            if (e instanceof Error) {
                showToast(e.message, "error");
            }
        }
    };

    return (
        <Card className="w-75 h-fit p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="email" placeholder="Write your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full h-11 mt-4 text-md">
                        Reset Password
                    </Button>
                </form>
            </Form>
        </Card>
    )
}
