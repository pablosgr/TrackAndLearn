'use client';

import { CircleQuestionMark } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ExportTestButton(
{
    testId
} : {
    testId: number
}) {
    const handleDownload = async () => {
        const response = await fetch(`/api/tests/${testId}/export`);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `track&learn-test${testId}.xlsx`;

        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    return (
        <div className='flex flex-row gap-2 items-center'>
            <Button onClick={handleDownload}>Export for Carousel</Button>
            <Tooltip>
                <TooltipTrigger>

                        <CircleQuestionMark
                            className={`
                                text-gray-400 hover:text-gray-500
                                dark:text-white/50 dark:hover:text-white/70
                                hover:cursor-pointer transition-colors
                            `}
                        />

                </TooltipTrigger>
                <TooltipContent className='p-3'>
                    <p>
                        For more information on Carousel Learning, please check the
                        <Link href={'/about'}><b> About</b></Link> section.
                    </p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
