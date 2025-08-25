'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { showToast } from "@/utils/general/showToast";
import { updatePassword } from "@/app/(protected)/profile/actions/update";
import PasswordInput from "./PasswordInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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


const formSchema = z.object({
    current_password: z.string().min(1, { message: 'Password cannot be empty' }),
    new_password: z.string().min(8, { message: 'Password must have at least 8 characters' }).max(150),
    confirm_password: z.string().min(8, { message: 'Password must have at least 8 characters' }).max(150),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

export default function PasswordDialog() {
    const router = useRouter();
    const {user} = useUser();
    const [open, setOpen] = useState<boolean>(false);

    const handleCancel = () => {
        form.clearErrors();
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
                showToast(e.message, 'error');
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
                        Reset password
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Set a new password for your account
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <PasswordInput
                            control={form.control}
                            type="reset"
                            label="Current Password"
                            name="current_password"
                            placeholder="Write your current password"
                        />
                        <PasswordInput
                            control={form.control}
                            type="reset"
                            label="New Password"
                            name="new_password"
                            placeholder="Write your new password"
                        />
                        <PasswordInput
                            control={form.control}
                            type="reset"
                            label="Confirm New Password"
                            name="confirm_password"
                            placeholder="Confirm your new password"
                        />
                        <DialogFooter className="pt-4 items-center sm:justify-between">
                            <p></p>
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
