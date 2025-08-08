'use client'

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@/components/context/userWrapper";
import { TestType } from "@/types/test/TestType";
import TakeTestCard from "@/components/classrooms/TakeTestCard";
import { Button } from "@/components/ui/button";

export default function StudentTestClient({ 
    test,
    classroomId,
    resultStatus,
}: {
    test: TestType,
    classroomId: string,
    resultStatus: { status: string, started_at: string } | null
}) {
    const [isTestStarted, setIsTestStarted] = useState<boolean>(resultStatus !== null);
    const [isStarting, setIsStarting] = useState<boolean>(false);
    const user = useUser();

    const handleStartTest = async () => {
        setIsStarting(true);
        // generate a new test result (requ. classId, testId, userId)
    }

    return (
        <>
        {
            !isTestStarted &&
            
            <section className="w-160 h-full flex flex-col gap-6 items-center justify-center">
                <h2 className="text-lg">Please, read the information below before starting the test</h2>
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
            (isTestStarted && resultStatus) &&
            <TakeTestCard test={test} startTime={resultStatus.started_at}/>
        }
        </>
    )
}
