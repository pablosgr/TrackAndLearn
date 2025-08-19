import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { updatePassword } from "@/app/(protected)/profile/actions/update";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
    current_password: z.string()
        .min(1, { message: 'Password cannot be empty' }),
    new_password: z.string()
        .min(8, { message: 'Password must have at least 8 characters' })
        .max(150),
    confirm_password: z.string()
        .min(8, { message: 'Password must have at least 8 characters' })
        .max(150),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function PasswordDialog() {
    const router = useRouter();
    const {user} = useUser();
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCancel = () => {
        form.clearErrors();
        setError(null);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_password: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null);

        try {
            await updatePassword(
                user.id,
                user.email,
                values.current_password,
                values.new_password
            );
            setOpen(false);
            router.refresh();
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="max-w-34">
                    Reset password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Reset your password
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Set a new password for your account
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Current Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Write your current password" 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        New Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Write your new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Confirm New Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Write your new password again"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4 items-center sm:justify-between">
                            <p className="text-chart-r max-w-40 truncate">
                                {
                                    error && error
                                }
                            </p>
                            <div className="flex flex-row gap-3">
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                </DialogClose>
                                <Button type="submit">
                                    Save changes
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
