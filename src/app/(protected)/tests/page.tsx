'use client'

import { useUser } from "@/components/userWrapper";
import { getTests } from "./actions";
import { useEffect, useState } from "react";
import Link from "next/link";
import TestTemplateType from "@/types/test/TestTemplateType";

export default function Tests() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tests, setTests] = useState<TestTemplateType[] | null>(null)

    const userData = useUser();

    const fetchTests = async () => {
        const tests = await getTests(userData.id);
        setTests(tests);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchTests();
    }, []);

    return (
        <div className="flex flex-row justify-items-center">
            <p>Welcome, {userData.name}. You are in tests page now</p>
            <ul className="flex flex-col gap-3 p-3 bg-cyan-400">
                {
                    isLoading && <p>Loading..</p>
                }
                {
                    !isLoading && (
                        tests && tests.map((t) => (
                            <li key={t.id}><Link href={`/tests/${t.id}`} >{t.name}</Link></li>
                        ))
                    )
                }
            </ul>
        </div>
    )
}
