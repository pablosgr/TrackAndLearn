import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";
import { updateTestResult } from "@/app/(protected)/classrooms/actions/update";
import { createTestResponses } from "@/app/(protected)/classrooms/actions/post";
import { getTestResponses } from "@/utils/tests/getTestResponses";
import { setFinalTestResult } from "@/utils/tests/setTestResult";
import { TestType } from "@/types/test/TestType";
import { TestResultType } from "@/types/test/TestResultType";
import TakeQuestionCard from "./TakeQuestionCard";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
    answers: z.record(z.string(), z.string()),
});

export type TakeTestFormValues = z.infer<typeof formSchema>;

export function TakeTestCard({
    test,
    startTime,
    provisionalResult,
}: {
    test: TestType,
    startTime: string,
    provisionalResult: TestResultType
}) {
    const router = useRouter();
    const [takenTest] = useState<TestType>(test);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const executedRef = useRef(false);
    const remaining = useCountdown(startTime, test.time_limit, async () => {
        if (executedRef.current) return;
        executedRef.current = true;

        setIsSubmitting(true);
        const userAnswers = form.getValues().answers;
        const endedAt = new Date().toISOString();

        const userResponses = getTestResponses(userAnswers, test, provisionalResult.id);
        const finalResult = setFinalTestResult(userResponses, provisionalResult, endedAt);

        await updateTestResult(finalResult);
        await createTestResponses(userResponses);

        router.replace(`/classrooms/${finalResult.classroom_id}`);
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answers: {},
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        const endedAt = new Date().toISOString();

        const userResponses = getTestResponses(values.answers, test, provisionalResult.id);
        const finalResult = setFinalTestResult(userResponses, provisionalResult, endedAt);

        await updateTestResult(finalResult);
        await createTestResponses(userResponses);

        router.replace(`/classrooms/${finalResult.classroom_id}`);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full">
                <Card className="mb-3 sm:mb-0">
                    <CardHeader className="bg-primary gap-2 py-6 text-white dark:text-slate-800">
                        <CardTitle className="text-2xl dark:text-slate-800">{takenTest.name}</CardTitle>
                        <CardDescription className="text-md text-white dark:text-slate-800">{takenTest.level}</CardDescription>
                        {
                            (remaining && remaining !== 0) &&
                            <span>
                                {
                                    `${ Math.floor((remaining / 1000 / 60) % 60) } minutes 
                                    ${ Math.floor((remaining / 1000) % 60) } seconds left`
                                }
                            </span>
                        }
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5 px-0 sm:px-6">
                        {
                            takenTest.question.map((q) => (
                                <article key={q.id}>
                                    <TakeQuestionCard question={q} control={form.control}/>
                                </article>
                            ))
                        }
                        <Button
                            variant="default"
                            type="submit"
                            className="w-35 self-end"
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting
                                ? (
                                    <div className="flex flex-row gap-3 items-center">
                                        <LoaderCircle size={40} strokeWidth={3} className="animate-spin" />
                                        <span>Submitting..</span>
                                    </div>
                                ) : (
                                    'Submit'
                                )
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
