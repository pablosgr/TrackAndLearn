import { useState, useEffect } from "react";
import { PencilLine } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateQuestionById } from "@/app/(protected)/tests/actions/update";
import { getOptionsByQuestionId } from "@/app/(protected)/tests/actions/get";
import { QuestionType } from "@/types/test/QuestionType";
import { OptionType } from "@/types/test/OptionType";
import { EditQuestionType } from "@/types/test/EditQuestionType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardAction } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    question_text: z.string().min(3, { message: 'Question must have between 3 and 255 characters' }).max(255),
    options_number: z.number().min(2, { message: 'You must select a number of options' }),
    options: z.array(z.object({
        id: z.number().nullable(),
        option_text: z.string().min(1, 'Option text is required'),
        is_correct: z.boolean(),
        index_order: z.number().nullable(),
    })),
    correct_option_index: z.number().min(0),
});

export default function QuestionDialog({
    type,
    testId,
    question,
    onUpdate
}: {
    type: 'update' | 'create',
    testId: number,
    question: QuestionType,
    onUpdate: (testId: number, id: number, data: EditQuestionType, newOptions: OptionType[]) => void 
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [optionsNumber, setOptionsNumber] = useState<number>(question.options_number);

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                question_text: question.question_text,
                options_number: optionsNumber,
                options: question.option.map((opt) => (
                    {
                        id: opt.id,
                        option_text: opt.option_text,
                        is_correct: opt.is_correct,
                        index_order: opt.index_order,
                    }
                )),
                correct_option_index: question.option.findIndex((opt) => opt.is_correct === true),
            },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    useEffect(() => {
        const current = form.getValues("options");

        if (optionsNumber > current.length) {
            for (let i = current.length; i < optionsNumber; i++) {
                append({ id: null, option_text: "", is_correct: false, index_order: i });
            }
        } else if (optionsNumber < current.length) {
            for (let i = current.length; i > optionsNumber; i--) {
                remove(i - 1);
            }
        }

        const currentIndex = form.getValues('correct_option_index');
        
        if (currentIndex >= optionsNumber) {
            form.setValue('correct_option_index', optionsNumber - 1);
        }
    }, [optionsNumber]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        values.options.forEach((opt, index) => {
            values.correct_option_index === index
            ? opt.is_correct = true
            : opt.is_correct = false;
        });

        const data = {
            question_text: values.question_text,
            options_number: values.options_number,
            options: values.options,
        }

        await updateQuestionById(question.id, data);
        const newOptions = await getOptionsByQuestionId(question.id);
        onUpdate(testId, question.id, data, newOptions);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CardAction className="p-2 hover:bg-(--accent) hover:cursor-pointer rounded-lg transition-colors">
                        <PencilLine size={22} color="gray"/>
                </CardAction>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[490px] max-h-[85%] overflow-scroll scrollbar-invisible">
                <DialogHeader>
                    <DialogTitle>Edit question</DialogTitle>
                    <DialogDescription>Remember to mark the correct answer (only one can be correct)</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="question_text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Question text
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Write your question" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="options_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <span>Options number</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select 
                                            value={field.value.toString()}
                                            onValueChange={(val) => {
                                                const numericVal = Number(val);
                                                field.onChange(numericVal);
                                                setOptionsNumber(numericVal);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select number of options" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="2">2</SelectItem>
                                                    <SelectItem value="4">4</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-1">
                                    <FormField
                                        control={form.control}
                                        name={`options.${index}.option_text`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Option {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Write your option" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))
                        }
                        <FormField
                            control={form.control}
                            name="correct_option_index"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <span>Select the correct option</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup 
                                            defaultValue={field.value?.toString()}
                                            value={field.value?.toString()}
                                            onValueChange={(val) => field.onChange(parseInt(val))}
                                            className="flex flex-row items-center gap-6"
                                        >
                                            {fields.map((f, index) => (
                                                <div key={f.id} className="flex items-center gap-2">
                                                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                                    <Label htmlFor={`option-${index}`}>
                                                        Option { index + 1 }
                                                    </Label>
                                                </div>
                                                ))}
                                            </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => form.reset()}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
