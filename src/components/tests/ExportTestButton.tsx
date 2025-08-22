'use client';

import { Button } from "../ui/button";

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
        <Button onClick={handleDownload}>Export for Carousel</Button>
    )
}
