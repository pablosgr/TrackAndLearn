import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../context/userWrapper";
import { useRouter } from "next/navigation";
import { fetchLLMTestResponse } from "@/utils/llm/fetchLLMTestResponse";
import { createGeneratedTest } from "@/app/(protected)/tests/actions/post";
import { formatPrompt } from "@/utils/llm/formatPrompt";
import { Bot, LoaderCircle } from 'lucide-react';
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { TopicType } from "@/types/test/TopicType";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    description: z.string().min(3, { message: 'Description must have between 3 and 500 characters' }).max(250),
    level: z.string().min(3, { message: 'Level must have between 3 and 100 characters' }).max(100),
    topic_id: z.string().min(1, { message: 'You must select a topic' }),
    adaptation_id: z.number().nullable(),
});

export default function GenerateTestDialog({
    adaptationList,
    topicList,
    onGenerate,
}: {
    adaptationList: AdaptationType[],
    topicList: TopicType[],
    onGenerate: (newTest: TestTemplateType) => void,
}) {
    const user = useUser();
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
            level: '',
            topic_id: '',
            adaptation_id: null,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null);
        setIsGenerating(true);

        const selectedTopic = topicList.find((t) => t.id === Number(values.topic_id));
        const selectedAdaptation = adaptationList.find((a) => a.id === values.adaptation_id);

        const prompt = formatPrompt(
            values.description,
            values.level,
            selectedTopic?.name!,
            selectedAdaptation?.name ?? null
        );

        try {
            const llmResponse = await fetchLLMTestResponse(prompt);

            if (!llmResponse) {
                throw new Error('Error generating test');
            }

            const formattedResponse = JSON.parse(llmResponse);
            console.log(formattedResponse);

            const newTemplate = await createGeneratedTest(
                formattedResponse,
                user.id,
                selectedTopic!,
                values.level,
                values.adaptation_id
            );

            if (!newTemplate) {
                throw new Error('Error saving generated test');
            }

            onGenerate(newTemplate);
            setOpen(false);
            router.refresh();

        } catch (e) {
            console.error(e);
            setError('An error occurred, please try again');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="flex flex-row items-center gap-3">
                    <Bot size={22} />
                    <span>Generate with AI</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Generate test with AI
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Generate a test and, optionally, a related adapted version
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                                                        topicList && topicList.map((t) => (
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
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea 
                                        placeholder={`Provide a focused description, e. g. 'Divisions focusing on decimal numbers, including both integer and decimal operands'`}
                                        {...field}
                                        />
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
                                            placeholder="Set a level for your test, e. g. 'Primary 6'"
                                            {...field}
                                            value={field.value ?? ''}/>
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
                                        <span>Generate Adaptation</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value !== null ? field.value.toString() : 'null'}
                                            onValueChange={(val) => field.onChange(val === 'null' ? null : Number(val))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select adaptation to generate (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="null">None</SelectItem>
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
                            {
                                error &&
                                <span className="text-red-500">{error}</span>
                            }
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => form.clearErrors()}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isGenerating}>
                                {
                                    isGenerating
                                    ? <>
                                        <LoaderCircle size={22} className="animate-spin" />
                                        <span>Generating..</span>
                                        </>
                                    : 'Generate'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
