'use client';

import type { ClassroomResultType } from "@/types/test/ClassroomResultType";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function QuestionsResultsCard({
    classroomResults
} : {
    classroomResults: ClassroomResultType[]
}) {
    const incorrectQuestions: Record<number, number> = {};
    const correctQuestions: Record<number, number> = {};
    const incorrectQuestionsText: Record<number, string> = {};
    const correctQuestionsText: Record<number, string> = {};

    classroomResults.forEach((item) => {
        item.response.forEach((res) => {
            const qid = res.question_id;
            const qtext = item.test_data.question.find((q) => q.id === qid)?.question_text;

            if (!res.is_correct) {
                incorrectQuestions[qid] = (incorrectQuestions[qid] || 0) + 1;
                incorrectQuestionsText[qid] = qtext ? qtext : '';
            }

            if (res.is_correct) {
                correctQuestions[qid] = (correctQuestions[qid] || 0) + 1;
                correctQuestionsText[qid] = qtext ? qtext : '';
            }
        });
    });

    const sortedIncorrect = Object.entries(incorrectQuestions)
        .map(([qid, count]) => [Number(qid), count] as [number, number])
        .sort(([, countA], [, countB]) => countB - countA);

    const sortedCorrect = Object.entries(correctQuestions)
        .map(([qid, count]) => [Number(qid), count] as [number, number])
        .sort(([, countA], [, countB]) => countB - countA);

    const displayLimit = Math.min(sortedCorrect.length, sortedIncorrect.length) === 0
        ? Math.max(sortedCorrect.length, sortedIncorrect.length)
        : Math.min(Math.min(sortedCorrect.length, sortedIncorrect.length), 5);

    const incorrectChartData = [];
    const correctChartData = [];

    for (let i = 0; i < displayLimit; i++) {
        const newCorrectItem = {
            question: `${correctQuestionsText[sortedCorrect[i][0]]}`,
            value: sortedCorrect[i][1]
        };

        correctChartData.push(newCorrectItem);

        if (sortedIncorrect.length > 0) {
            const newIncorrectItem = {
                question: `${incorrectQuestionsText[sortedIncorrect[i][0]]}`,
                value: sortedIncorrect[i][1]
            };

            incorrectChartData.push(newIncorrectItem);
        }
    }
    
    const correctChartConfig = {
        value: { label: 'Correct', color: 'var(--color-chart-g)' }
    } satisfies ChartConfig;

    const incorrectChartConfig = {
        value: { label: "Incorrect", color: 'var(--color-chart-r)' }
    } satisfies ChartConfig;

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center">
                <CardTitle>Most correct and incorrect questions for {classroomResults[0].test_data.name}</CardTitle>
                <CardDescription>These charts display a maximum of 5 questions each</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row pb-2 gap-5">
                {
                    sortedCorrect.length > 0 &&
                    <ChartContainer config={correctChartConfig} className="flex-1 max-h-120">
                        <BarChart
                            accessibilityLayer
                            data={correctChartData}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="question"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="value" fill="var(--color-chart-g)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                }
                {
                    sortedIncorrect.length > 0 &&
                    <ChartContainer config={incorrectChartConfig} className="flex-1 max-h-120">
                        <BarChart
                            accessibilityLayer
                            data={incorrectChartData}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="question"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="value" fill="var(--color-chart-r)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                }
            </CardContent>
        </Card>
    )
}
