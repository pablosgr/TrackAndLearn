'use client'

import { useState } from "react";
import Link from "next/link";
import TestTemplateType from "@/types/test/TestTemplateType";

export default function TestsPageClient({ data }: { data: TestTemplateType[] }) {
    const [tests] = useState<TestTemplateType[]>(data);

    return (
        <div className="flex flex-col justify-items-center">
            <ul className="flex flex-row gap-6 p-4 mt-2 rounded-md bg-cyan-100">
                {
                    tests && tests.map((t) => (
                        <Link href={`/tests/${t.id}`} key={t.id}>
                            <li className="w-fit h-30 border-1 border-blue-950 bg-zinc-400 p-3 rounded-lg" >
                                Test: {t.name}
                            </li>
                        </Link>
                    ))
                }
            </ul>
        </div>
    )
}
