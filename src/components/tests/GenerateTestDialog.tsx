'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../context/userWrapper";
import { useRouter } from "next/navigation";
import { fetchLLMTestResponse } from "@/utils/llm/fetchLLMTestResponse";
import { showToast } from "@/utils/general/showToast";
import { createGeneratedTest } from "@/app/(protected)/tests/actions/post";
import { formatPrompt } from "@/utils/llm/formatPrompt";
import { Bot, LoaderCircle } from 'lucide-react';
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { TopicType } from "@/types/test/TopicType";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "../ui/label";
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
    pdf: z.instanceof(File).optional()
        .refine(file => !file || file.type === 'application/pdf', { message: 'File must be a PDF' })
        .refine(file => !file || file.size <= 20 * 1024 * 1024, { message: 'Max size is 20MB' })
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
    const {user} = useUser();
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

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
        setIsGenerating(true);

        const selectedTopic = topicList.find((t) => t.id === Number(values.topic_id));
        const selectedAdaptation = adaptationList.find((a) => a.id === values.adaptation_id);
        let pdfBase64: string | null = null;

        if (values.pdf) {
            pdfBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(values.pdf!);
            });
        }

        const prompt = formatPrompt(
            'test',
            values.description,
            selectedAdaptation?.name ?? null,
            values.level,
            selectedTopic?.name,
            pdfBase64
        );

        try {
            const llmResponse = await fetchLLMTestResponse(prompt, pdfBase64);

            if (!llmResponse) {
                throw new Error('Error generating test');
            }

            const formattedResponse = JSON.parse(llmResponse);

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

            showToast('Test created successfully', 'success');
            onGenerate(newTemplate);
            setOpen(false);
            form.reset();
            router.refresh();

        } catch (e) {
            console.error(e);
            showToast('An error ocurred, please try again', 'error');
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
            <DialogContent className="sm:max-w-[500px] max-h-[92%] overflow-scroll scrollbar-invisible">
                <DialogHeader>
                    <DialogTitle>
                        Generate test with AI
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Generate a test from a description and/or reference PDF, optionally including an adapted version
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
                            name="pdf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <span>Attach PDF (optional, max 20MB)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Label
                                                htmlFor="input-file"
                                                className={`
                                                    flex flex-row gap-3
                                                    hover:cursor-pointer border-input border-1 
                                                    hover:bg-accent text-card-foreground px-3 py-2
                                                    shadow-xs rounded-md transition-colors
                                                `}
                                            >
                                                <span className="text-sm text-card-foreground">
                                                    {field.value ? field.value.name : "No file selected"}
                                                </span>
                                            </Label>
                                            <Input
                                                type="file"
                                                id="input-file"
                                                className="hidden"
                                                accept="application/pdf"
                                                onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                                            />
                                        </div>
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
                                        <span>Generate Adaptation (optional)</span>
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
