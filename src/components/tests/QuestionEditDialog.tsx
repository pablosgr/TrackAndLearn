import { useState, useEffect } from "react";
import { PencilLine } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionType } from "@/types/test/QuestionType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardAction } from "../ui/card";
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
        option_text: z.string().min(1, 'Option text is required'),
        is_correct: z.boolean(),
    })),
});

export default function QuestionEditDialog({ question }: { question: QuestionType }) {
    const [open, setOpen] = useState<boolean>(false);
    const [optionsNumber, setOptionsNumber] = useState<number>(question.options_number);

    useEffect(() => {
        const current = form.getValues("options");

        if (optionsNumber > current.length) {
            for (let i = current.length; i < optionsNumber; i++) {
                append({ option_text: "", is_correct: false });
            }
        } else if (optionsNumber < current.length) {
            for (let i = current.length; i > optionsNumber; i--) {
                remove(i - 1);
            }
        }
    }, [optionsNumber]);

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                question_text: question.question_text,
                options_number: optionsNumber,
                options: question.option.map((o) => (
                    {
                        option_text: o.option_text,
                        is_correct: o.is_correct,
                    }
                )),
            },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CardAction className="p-2 hover:bg-(--accent) hover:cursor-pointer rounded-lg transition-colors">
                        <PencilLine size={22}/>
                </CardAction>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[490px]">
                <DialogHeader>
                    <DialogTitle>Edit question</DialogTitle>
                    <DialogDescription>Remember to mark the correct answer (only one can be correct)</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form  className="flex flex-col gap-6">
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
                                    <FormLabel>
                                        Options number
                                    </FormLabel>
                                    <FormControl>
                                        <Select 
                                            value={field.value.toString()}
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                setOptionsNumber(Number(val));
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an options number" />
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
