'use client';

import type { ClassroomResultType } from "@/types/test/ClassroomResultType";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AverageScoreCard({
    classroomResults
} : {
    classroomResults: ClassroomResultType[]
}) {
    let count = 0;
    let scoreSum = 0;
    const highScores = [];
    const midScores = [];
    const lowScores = [];

    classroomResults.forEach((i) => {
        count ++;
        scoreSum += i.score;

        if (i.score < 5) {
            lowScores.push(i);
        } else if (i.score < 7) {
            midScores.push(i);
        } else {
            highScores.push(i);
        }
    });

    const averageScore = scoreSum / count;

    const chartData = [
        { score: "high", students: highScores.length, fill: "var(--color-chart-g)" },
        { score: "mid", students: midScores.length, fill: "var(--color-chart-y)" },
        { score: "low", students: lowScores.length, fill: "var(--color-chart-r)" }
    ];
    
    const chartConfig = {
        students: {
            label: "Students"
        },
        high: {
            label: "High (7 to 10)"
        },
        mid: {
            label: "Mid (5 to 7)"
        },
        low: {
            label: "Low (0 to 5)"
        }
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center">
                <CardTitle>Average Score</CardTitle>
                <CardDescription>Score is calculated out of 10</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="students"
                            nameKey="score"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                            {averageScore.toFixed(2)}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                                >
                                                Average Score
                                            </tspan>
                                        </text>
                                    )
                                }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="text-sm self-center text-gray-500 dark:text-white/60">
                <p>*Based on {count} recorded results</p>
            </CardFooter>
        </Card>
    )
}
