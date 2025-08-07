'use client'

import { TestType } from "@/types/test/TestType";
import TakeTestCard from "@/components/classrooms/TakeTestCard";

export default function StudentTestClient({ test }: { test: TestType }) {

    return (
        <TakeTestCard test={test} />
    )
}
