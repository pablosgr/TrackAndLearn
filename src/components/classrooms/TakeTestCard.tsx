import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";
import { updateTestResult } from "@/app/(protected)/classrooms/actions/update";
import { TestType } from "@/types/test/TestType";
import { TestResultType } from "@/types/test/TestResultType";
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
    provisionalResult,
}: {
    test: TestType,
    startTime: string,
    provisionalResult: TestResultType
}) {
    const router = useRouter();
    const [takenTest] = useState<TestType>(test);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const remaining = useCountdown(startTime, test.time_limit, async () => {
        await updateTestResult(provisionalResult.id);
        router.replace(`/classrooms/${provisionalResult.classroom_id}`);
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answers: {},
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        console.log("Submitted answers from all questions:", values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full">
                <Card>
                    <CardHeader className="bg-(--color-accent) gap-2 py-6">
                        <CardTitle className="text-2xl">{takenTest.name}</CardTitle>
                        <CardDescription className="text-md">{takenTest.level}</CardDescription>
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
                    <CardContent className="flex flex-col gap-5">
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
