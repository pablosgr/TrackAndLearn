'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
    code: z.string().min(1, { message: 'Field cannot be empty' }),
});


export default function CodeResetForm(
{
    email,
    codeUpdate
}: {
    email: string,
    codeUpdate: (newCode: string) => void
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { code: "" },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const supabase = createClient();
        const {
            data: { session },
            error,
            } = await supabase.auth.verifyOtp({
            email: email,
            token: values.code,
            type: 'email',
            })

        if (error) {
            showToast(error.message, "error");
        }

        if (session) {
            codeUpdate(values.code);
            showToast("Code verified. Please reset your password", "success");
        }
    };

    return (
        <Card className="w-75 h-fit p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="Write code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full h-11 mt-4 text-md">
                        Validate code
                    </Button>
                </form>
            </Form>
        </Card>
    )
}
