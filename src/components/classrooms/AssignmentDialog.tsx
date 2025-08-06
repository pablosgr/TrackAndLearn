import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { assignTestTemplate } from "@/app/(protected)/classrooms/actions/post";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { AssignedTestType } from "@/types/test/AssignedTestType";
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
    test_template_id: z.string().min(1, { message: 'You must select a topic' }),
});

export default function AssignmentDialog({
    type,
    classroomId,
    availableTests,
    onAssign,
    onUpdate,
}: {
    type: 'update' | 'create',
    classroomId: number,
    availableTests: TestTemplateType[],
    onAssign?: (newAssignment: AssignedTestType) => void,
    onUpdate?: (updatedTemplate: TestTemplateType) => void
}) {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            test_template_id: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (type === 'create' && onAssign) {
            const newAssignment = await assignTestTemplate(classroomId, Number(values.test_template_id));

            if (!newAssignment) {
                form.setError('test_template_id', {
                    type: 'manual',
                    message: 'Test already assigned'
                });
                return;
            }

            onAssign(newAssignment);
            form.reset();
            setOpen(false);
            router.refresh();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    type === 'create'
                    ? <Button variant="default" className="w-30">Assign test</Button>
                    : <CardAction className="p-2 hover:bg-cyan-100 hover:cursor-pointer rounded-lg transition-colors">
                        <PencilLine size={22} />
                    </CardAction>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            type === 'create'
                            ? 'Assign new test'
                            : 'Edit assignment'
                        }
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {
                            type === 'create'
                            ? 'This action will assign a test to the classroom, including their adapted versions.'
                            : 'Edit assignment information'
                        }
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="test_template_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <span>Test</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a test" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        availableTests && availableTests.map((t) => (
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
                                    ? 'Assign test'
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
