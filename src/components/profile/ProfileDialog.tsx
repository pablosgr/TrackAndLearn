import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { UserContextType } from "@/types/context/UserContextType";
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
    name: z.string().min(2, { message: 'Name must have between 2 and 150 characters' }).max(150),
    username: z.string().min(2, { message: 'Username must have between 2 and 10 characters' }).max(10),
});

export default function TemplateDialog({
    onUpdate,
}: {
    onUpdate?: (updatedUser: UserContextType) => void
}) {
    const router = useRouter();
    const {user} = useUser();
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            username: user.username
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // const updatedUser = await updateUserById(user.id);
        // if (updatedUser) {
        //     onUpdate(updatedUser);
        // }

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Edit profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Edit profile
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Update your account information
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Write your name" {...field}/>
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
                                    <FormLabel>
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Write your username" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => form.clearErrors()}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
