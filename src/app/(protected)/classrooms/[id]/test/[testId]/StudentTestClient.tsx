'use client'

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@/components/context/userWrapper";
import { createTestResult } from "../../../actions/post";
import { TestType } from "@/types/test/TestType";
import { TestResultType } from "@/types/test/TestResultType";
import TakeTestCard from "@/components/classrooms/TakeTestCard";
import { Button } from "@/components/ui/button";

export default function StudentTestClient({ 
    test,
    classroomId,
    result,
}: {
    test: TestType,
    classroomId: string,
    result: TestResultType | null
}) {
    const {user} = useUser();
    const [isTestStarted, setIsTestStarted] = useState<boolean>(result?.status === 'ongoing');
    const [provResult, setProvResult] = useState<TestResultType | null>(result);
    const [isStarting, setIsStarting] = useState<boolean>(false);

    const handleStartTest = async () => {
        setIsStarting(true);
        const newResult = await createTestResult(user?.id, classroomId, test.id);
        if (newResult) {
            setProvResult(newResult);
            setIsTestStarted(true);
        }
        setIsStarting(false);
    }

    return (
        <>
        {
            !isTestStarted &&
            
            <section className="w-160 h-full flex flex-col gap-6 items-center justify-center">
                <h2 className="text-2xl">Please, read the information below before starting the test!</h2>
                <p className="text-center">
                    {`
                        This test has ${test.time_limit
                        ? `a time limit of ${test.time_limit} minutes. 
                        You can exit the page and enter again, but the timer won't stop once you start it. ` 
                        : 'no time limit. You can exit the page and enter again. '}
                        When you feel ready, press the button to begin.
                    `}
                </p>
                <Button
                    className="w-42 h-12 text-md"
                    variant={'default'}
                    onClick={handleStartTest}
                    disabled={isStarting}
                >
                    {
                        isStarting
                        ? (
                            <div className="flex flex-row gap-3 items-center">
                                <LoaderCircle size={40} strokeWidth={3} className="animate-spin" />
                                <span>Starting..</span>
                            </div>
                        ) : (
                            'Start Test'
                        )
                    }
                </Button>
            </section>
        }
        {
            (isTestStarted && provResult) &&
            <TakeTestCard 
                test={test}
                startTime={provResult.started_at}
                provisionalResult={provResult}
            />
        }
        </>
    )
}
