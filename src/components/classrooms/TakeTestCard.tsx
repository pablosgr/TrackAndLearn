import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { TestType } from "@/types/test/TestType";
import TakeQuestionCard from "./TakeQuestionCard";
import { Button } from "../ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
    answers: z.record(z.string(), z.string()),
});

export default function TakeTestCard({
    test,
    startTime,
}: {
    test: TestType,
    startTime: string
}) {
    const [takenTest, setTakenTest] = useState<TestType>(test);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answers: {},
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Submitted answers from all questions:", values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full">
                <Card>
                    <CardHeader className="bg-(--color-accent) gap-2 py-6">
                        <CardTitle className="text-2xl">{takenTest.name}</CardTitle>
                        <CardDescription className="text-md">{takenTest.level}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        {
                            takenTest.question.map((q) => (
                                <article key={q.id}>
                                    <TakeQuestionCard question={q} control={form.control}/>
                                </article>
                            ))
                        }
                        <Button variant="default" type="submit" className="w-30 self-end">
                            Submit
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
