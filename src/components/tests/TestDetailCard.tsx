import QuestionDetailCard from "./QuestionDetailCard";
import { TestType } from "@/types/test/TestType";
import Link from "next/link";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TestDetailCard({ test }: { test: TestType }) {

    return (
        <Card className="w-full shadow-none border-0">
            <CardHeader>
                <CardTitle className="text-lg truncate">{test.name}</CardTitle>
                <CardDescription>
                    {
                        test.time_limit
                        ? `This test has a time limit of ${test.time_limit} minutes`
                        : 'This test has no time limit.'
                    }
                    { 
                        test.adaptation_data 
                        ? ` This test is adapted for ${test.adaptation_data.name}.` 
                        : ' This test is not adapted.' 
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {
                    test.question.map((q) => (
                        <QuestionDetailCard key={q.id} question={q} />
                    ))
                }
            </CardContent>
        </Card>
    )
}
