'use client';

import type { ClassroomResultType } from "@/types/test/ClassroomResultType";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

    let limit = Math.min(sortedCorrect.length, sortedIncorrect.length);
    limit = limit < 5 ? limit : 5;

    const incorrectChartData = [];
    const correctChartData = [];

    for (let i = 0; i < limit; i++) {
        const newIncorrectItem = {
            question: `q${sortedIncorrect[i][0]}`,
            value: sortedIncorrect[i][1],
            fill: 'tomato'
        };

        incorrectChartData.push(newIncorrectItem);

        const newCorrectItem = {
            question: `q${sortedCorrect[i][0]}`,
            value: sortedCorrect[i][1],
            fill: '#27F554'
        };

        correctChartData.push(newCorrectItem);
    }
    
    const correctChartConfig = {
        value: { label: "Correct" },
        ...Object.fromEntries(
            sortedCorrect.map(([qid]) => [
                `q${qid}`, 
                { label: correctQuestionsText[qid] || `Q${qid}` }
            ])
        )
    } satisfies ChartConfig;

    const incorrectChartConfig = {
        value: { label: "Incorrect" },
        ...Object.fromEntries(
            sortedIncorrect.map(([qid]) => [
                `q${qid}`, 
                { label: incorrectQuestionsText[qid] || `Q${qid}` }
            ])
        )
    } satisfies ChartConfig;

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center">
                <CardTitle>Most correct and failed questions for {classroomResults[0].test_data.name}</CardTitle>
                <CardDescription>These charts display a maximum of 5 questions each</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row pb-0">
                <ChartContainer config={correctChartConfig} className="flex-1">
                    <BarChart
                        accessibilityLayer
                        data={correctChartData}
                        layout="vertical"
                        margin={{
                            left: 20,
                        }}
                    >
                        <YAxis
                            dataKey="question"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                correctChartConfig[value as keyof typeof correctChartConfig]?.label
                            }
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="value" layout="vertical" radius={5} />
                    </BarChart>
                    </ChartContainer>
                    <ChartContainer config={incorrectChartConfig} className="flex-1">
                    <BarChart
                        accessibilityLayer
                        data={incorrectChartData}
                        layout="vertical"
                        margin={{
                            left: 30,
                        }}
                    >
                        <YAxis
                            dataKey="question"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                incorrectChartConfig[value as keyof typeof incorrectChartConfig]?.label
                            }
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="value" layout="vertical" radius={5} />
                    </BarChart>
                    </ChartContainer>
            </CardContent>
        </Card>
    )
}
