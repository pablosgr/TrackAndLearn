'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import TestCard from "@/components/tests/TestCard";
import TestTemplateType from "@/types/test/TestTemplateType";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function TestsPageClient({ data }: { data: TestTemplateType[] }) {
    const [tests, setTests] = useState<TestTemplateType[]>(data);

    const handleDelete = (id: string) => {
        setTests(tests.filter((t) => t.id !== id));
    }

    return (
        <>
            <header className="flex flex-row items-center justify-between pb-10">
                <h1 className="text-3xl">My tests</h1>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="default">Add test</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add new test</DialogTitle>
                                <DialogDescription className="pt-2">
                                    This action will create a test template with a base test attached.
                                </DialogDescription>
                            </DialogHeader>
                            <section className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input id="name-1" name="name" placeholder="Test template name" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="username-1">Topic</Label>
                                    <Input id="username-1" name="username" placeholder="Select a topic" />
                                </div>
                            </section>
                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Create test</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </header>
            <section className="flex flex-col justify-items-center">
                <ul className="flex flex-row flex-wrap gap-9">
                    {
                        tests && tests.map((t) => (
                            <TestCard key={t.id} test={t} onDelete={handleDelete}/>
                        ))
                    }
                </ul>
            </section>
        </>
    )
}
