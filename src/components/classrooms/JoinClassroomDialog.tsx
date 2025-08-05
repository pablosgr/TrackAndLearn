import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userWrapper";
import { enrollStudent } from "@/app/(protected)/classrooms/actions/post";
import { ClassroomType } from "@/types/classroom/ClassroomType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardAction } from "../ui/card";
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
    code: z.string().length(6, { message: 'Code must be exactly 6 characters long' })
});

export default function JoinClassroomDialog({
    version,
    size,
    onJoin,
}: {
    version: 'outline' | 'default',
    size?: 'default' | 'lg',
    onJoin: (newClassroom: ClassroomType) => void,
}) {
    const router = useRouter();
    const user = useUser();
    const [open, setOpen] = useState<boolean>(false);
    const chosenSize = size ?? 'default';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const result = await enrollStudent(user.id, values.code);

        if (!result.success) {
            form.setError('code', {
                type: 'manual',
                message: result.message,
            });
            return;
        }
        
        onJoin(result.classroom!);
        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={version} size={chosenSize}>Join Classroom</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join a classroom</DialogTitle>
                    <DialogDescription className="pt-2">
                        Ask your teacher for the classroom code and write it here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Write the classroom code" {...field}/>
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
                                Join
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
