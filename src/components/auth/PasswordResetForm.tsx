'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/auth/actions";
import PasswordInput from "../profile/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { showToast } from "@/utils/general/showToast";

const formSchema = z.object({
    password: z.string()
        .min(8, { message: 'Password must have at least 8 characters' })
        .max(150),
    confirm_password: z.string()
        .min(8, { message: 'Password must have at least 8 characters' })
        .max(150),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


export default function PasswordResetForm(
{
    email
}: {
    email: string
}
) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { 
            password: "",
            confirm_password: "" 
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await resetPassword(values.confirm_password, email);

            showToast('Password updated. Redirecting to login', 'success');

            setTimeout(() => {
                router.replace('/');
            }, 2200);
        } catch (e) {
            if (e instanceof Error) {
                showToast(e.message, 'error');
            }
        }
    };

    return (
        <Card className="w-75 h-fit p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <PasswordInput
                        control={form.control}
                        type="reset"
                        name="password"
                        placeholder="Write your new password"
                    />
                    <PasswordInput
                        control={form.control}
                        type="reset"
                        name="confirm_password"
                        placeholder="Confirm your new password"
                    />
                    <Button type="submit" className="w-full h-11 mt-4 text-md">
                        Reset password
                    </Button>
                </form>
            </Form>
        </Card>
    )
}
