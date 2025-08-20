'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../context/userWrapper";
import { useRouter } from "next/navigation";
import { fetchLLMTestResponse } from "@/utils/llm/fetchLLMTestResponse";
import { showToast } from "@/utils/general/showToast";
import { createGeneratedTestVersions } from "@/app/(protected)/tests/actions/post";
import { formatPrompt } from "@/utils/llm/formatPrompt";
import { Bot, LoaderCircle } from 'lucide-react';
import { TestType } from "@/types/test/TestType";
import { AdaptationType } from "@/types/test/AdaptationType";
import { Button } from "@/components/ui/button";
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
    adaptation_id: z.string().min(1, { message: 'You must select an adaptation' }),
});

export default function GenerateVersionDialog({
    baseTest,
    adaptationList,
    onGenerate,
}: {
    baseTest: TestType,
    adaptationList: AdaptationType[],
    onGenerate: (newTest: TestType) => void,
}) {
    const {user} = useUser();
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            adaptation_id: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsGenerating(true);

        const selectedAdaptation = adaptationList.find((a) => a.id === Number(values.adaptation_id));
        const stringTest = JSON.stringify(baseTest);

        const prompt = formatPrompt(
            'version',
            stringTest,
            selectedAdaptation?.name!
        );

        try {
            const llmResponse = await fetchLLMTestResponse(prompt);

            if (!llmResponse) {
                throw new Error('Error generating test');
            }

            const formattedResponse = JSON.parse(llmResponse);
            console.log(formattedResponse);

            const formattedTest = [{
                template_id: baseTest.template_id,
                name: formattedResponse.tests[0].name,
                level: baseTest.level,
                time_limit: formattedResponse.tests[0].time_limit,
                adaptation_id: selectedAdaptation?.id ?? null
            }];
            console.log(formattedTest);

            const newVersion = await createGeneratedTestVersions(formattedResponse, formattedTest);

            if (!newVersion) {
                throw new Error('Error saving generated test');
            }

            onGenerate(newVersion[0]);
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
                    <span>Adapt with AI</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Generate adapted version with AI
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Generate an adapted version from the current test
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                                            value={field.value !== null ? field.value.toString() : 'null'}
                                            onValueChange={(val) => field.onChange(val === 'null' ? null : val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select adaptation to generate" />
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
                        <DialogFooter className="pt-4 items-center">
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
