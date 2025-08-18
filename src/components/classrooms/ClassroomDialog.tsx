import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { useUser } from "../context/userWrapper";
import { createClassroom } from "@/app/(protected)/classrooms/actions/post";
import { updateClassroomName } from "@/app/(protected)/classrooms/actions/update";
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
    name: z.string().min(3, { message: 'Name must have between 3 and 150 characters' }).max(150),
});

export default function ClassroomDialog({
    type,
    classroom,
    onCreate,
    onUpdate,
}: {
    type: 'update' | 'create',
    classroom?: ClassroomType,
    onCreate?: (newClassroom: ClassroomType) => void,
    onUpdate?: (updatedName: string) => void
}) {
    const router = useRouter();
    const user = useUser();
    const [open, setOpen] = useState<boolean>(false);

    const defaultClassroom = classroom ?? {
        id: 0,
        teacher_id: user.id,
        name: '',
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultClassroom.name,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (type === 'create' && onCreate) {
            const newClassroom = await createClassroom(values.name, Number(defaultClassroom.teacher_id));

            if (newClassroom) {
                onCreate(newClassroom);
                form.reset();
            }
        }

        if (type === 'update' && onUpdate) {
            const newName = await updateClassroomName(defaultClassroom.id, values.name);

            if (newName) {
                onUpdate(newName);
            }
        }

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    type === 'create'
                    ? <Button variant="default">Add Classroom</Button>
                    : <CardAction className="p-2 hover:bg-accent hover:text-primary hover:cursor-pointer rounded-lg transition-colors">
                        <PencilLine size={22} />
                    </CardAction>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            type === 'create'
                            ? 'Add new classroom'
                            : 'Edit classroom'
                        }
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {
                            type === 'create'
                            ? 'This action will create a new classroom'
                            : 'Edit classroom information'
                        }
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
                                        <Input placeholder="Name your classroom" {...field}/>
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
                                {
                                    type === 'create'
                                    ? 'Create classroom'
                                    : 'Save changes'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
