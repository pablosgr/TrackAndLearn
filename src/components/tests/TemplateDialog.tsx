import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { useUser } from "../context/userWrapper";
import { createTemplate} from "@/app/(protected)/tests/actions/post";
import { updateTemplateById } from "@/app/(protected)/tests/actions/update";
import { TopicType } from "@/types/test/TopicType";
import { TestTemplateType } from "@/types/test/TestTemplateType";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
    name: z.string().min(3, { message: 'Name must have between 3 and 150 characters' }).max(150),
    topic_id: z.string().min(1, { message: 'You must select a topic' }),
});

export default function TemplateDialog({
    type,
    test,
    topics,
    onCreate,
    onUpdate,
}: {
    type: 'update' | 'create',
    test?: TestTemplateType,
    topics: TopicType[],
    onCreate?: (newTemplate: TestTemplateType) => void,
    onUpdate?: (updatedTemplate: TestTemplateType) => void
}) {
    const router = useRouter();
    const {user} = useUser();
    const [open, setOpen] = useState<boolean>(false);

    const defaultTest = test ?? {
        id: '',
        name: '',
        topic_id: '',
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultTest.name,
            topic_id: defaultTest.topic_id.toString()
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (type === 'create' && onCreate) {
            const newTemplate = await createTemplate(values.name, values.topic_id, user.id);

            if (newTemplate) {
                onCreate(newTemplate);
                form.reset();
            }
        }

        if (type === 'update' && onUpdate) {
            const updatedTemplate = await updateTemplateById(Number(defaultTest.id), values.name, values.topic_id);
            if (updatedTemplate) {
                onUpdate(updatedTemplate);
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
                    ? <Button variant="default">Add test</Button>
                    : <CardAction className="p-2 hover:bg-primary hover:text-accent hover:cursor-pointer rounded-lg transition-colors">
                        <PencilLine size={22} />
                    </CardAction>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            type === 'create'
                            ? 'Add new test'
                            : 'Edit test'
                        }
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {
                            type === 'create'
                            ? 'This action will create a test template with an attached base test'
                            : 'Edit test information'
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
                                        <Input placeholder="Name your template" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="topic_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <span>Topic</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a topic" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        topics && topics.map((t) => (
                                                            <SelectItem key={t.id} value={t.id.toString()}>
                                                                {t.name}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                                    ? 'Create test'
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
