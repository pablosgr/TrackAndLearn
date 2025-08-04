import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateTestById } from "@/app/(protected)/tests/actions/update";
import { createTest } from "@/app/(protected)/tests/actions/post";
import { TestType } from "@/types/test/TestType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { NewTestType } from "@/types/test/TestType";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
    id: z.number(),
    template_id: z.number(),
    name: z.string().min(3, { message: 'Name must have between 3 and 150 characters' }).max(150),
    level: z.string().min(3, { message: 'Level must have between 3 and 100 characters' }).max(100).nullable(),
    time_limit: z.number().nullable(),
    adaptation_id: z.number().nullable(),
});

export default function TestDialog({
    type,
    templateName,
    templateId,
    test,
    adaptationList,
    onUpdate,
    onCreate,
}: {
    type: 'update' | 'create',
    templateName: string,
    templateId: number,
    test?: TestType,
    adaptationList: AdaptationType[],
    onUpdate?: (testId: number, data: NewTestType) => void,
    onCreate?: (newTest: TestType) => void,
}) {
    const defaultTest = test ?? {
        id: 0,
        template_id: templateId,
        name: '',
        level: '',
        time_limit: null,
        adaptation_id: type === 'create' && adaptationList.length > 0
            ? adaptationList[0].id
            : null,
    }

    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultTest.id,
            template_id: templateId,
            name: type === 'update' ? defaultTest.name : templateName,
            level: defaultTest.level,
            time_limit: defaultTest.time_limit,
            adaptation_id: defaultTest.adaptation_id,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (type === 'update' && onUpdate) {
            const updatedTest = await updateTestById(defaultTest.id, values);

            if (updatedTest) {
                onUpdate(defaultTest.id, values);
            }
        }

        if (type === 'create' && onCreate) {
            const newTest = await createTest(values);

            if (newTest) {
                onCreate(newTest);
                form.reset();
            }
        }

        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    type === 'update'
                    ? <Button variant="outline">Edit test</Button>
                    : <Button variant="default">Add version</Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            type === 'update'
                            ? 'Edit test'
                            : 'Create new version'
                        }
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {
                            type === 'create'
                            ? `Create a new test version for the template. 
                                Chosen adaptation will be added automatically to the name.`
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
                                        <Input placeholder="Name your test" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Level
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Set level for your test"
                                            {...field}
                                            value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time_limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Time Limit (in minutes)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Set time limit for your test (optional)" 
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="adaptation_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <span>Adaptation</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value != null ? field.value.toString() : 'null'}
                                            onValueChange={(val) => field.onChange(val === 'null' ? null : Number(val))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select adaptation (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        type === 'update' &&
                                                        <SelectItem value="null">None</SelectItem>
                                                    }
                                                    {
                                                        adaptationList.map((adpt) => (
                                                            <SelectItem key={adpt.id} value={adpt.id.toString()}>
                                                                {adpt.code} ({adpt.name})
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
                                    type === 'update'
                                    ? 'Save changes'
                                    : 'Add version'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
