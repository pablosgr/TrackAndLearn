'use client';

import { useState, useEffect } from "react";
import { useUser } from "@/components/context/userWrapper";
import { LoaderCircle, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/general/showToast";
import { getTestTemplatesByUserId } from "./actions/get";
import TemplateCard from "@/components/tests/TemplateCard";
import TemplateDialog from "@/components/tests/TemplateDialog";
import GenerateTestDialog from "@/components/tests/GenerateTestDialog";
import SearchBar from "@/components/general/SearchBar";
import DateSortSelect from "@/components/general/DateSortSelect";
import { TestTemplateType } from "@/types/test/TestTemplateType";
import { TopicType } from "@/types/test/TopicType";
import { AdaptationType } from "@/types/test/AdaptationType";

export default function TestsPageClient({ 
    testList,
    topicList,
    adaptationList,
}: { 
    testList: TestTemplateType[],
    topicList: TopicType[],
    adaptationList: AdaptationType[]
}) {
    const {user} = useUser();
    const [templates, setTemplates] = useState<TestTemplateType[]>(testList);
    const [visibleTemplates, setVisibleTemplates] = useState<TestTemplateType[]>(testList);
    const [range, setRange] = useState<[number, number]>([6, 11]);
    const [sort, setSort] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [isloading, setIsLoading] = useState<boolean>(false);
    const hasTests = templates.length > 0;

    useEffect(() => {
        applyFilters();
    }, [templates, search, sort]);

    const applyFilters = () => {
        const filtered = templates.filter(t =>
            (
                t.name.toLowerCase().includes(search.toLowerCase())
                || t.topic_data.name.toLowerCase().includes(search.toLowerCase())
            )
        );

        if (sort) {
            filtered.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sort === "asc" ? dateA - dateB : dateB - dateA;
            });
        }

        setVisibleTemplates(filtered);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
    }

    const handleDateSort = (value: string) => {
        setSort(value);
    };

    const handleDeleteTemplate = (id: string) => {
        setTemplates(templates.filter((t) => t.id !== id));
    }

    const handleCreateTemplate = (template: TestTemplateType) => {
        setTemplates(prevTests => [template, ...prevTests]);
    }

    const handleUpdateTemplate = (template: TestTemplateType) => {
        const topic = topicList.find((topic) => topic.id === Number(template.topic_id));

        setTemplates(prev =>
            prev.map((t) => 
                t.id === template.id
                ? {
                    ...t,
                    name: template.name,
                    topic_id: template.topic_id,
                    topic_data: {
                        name: topic?.name ?? t.topic_data.name
                    }
                }
                : t
            )
        );
    }

    const handleFetchTemplates = async () => {
        setIsLoading(true);
        const newTemplates: TestTemplateType[] = await getTestTemplatesByUserId(user.id, [range[0], range[1]]);

        if (newTemplates.length > 0) {
            setTemplates(prev => [...prev, ...newTemplates]);
            setRange([range[1] + 1, range[1] + 6]);
            handleDateSort(sort);
        } else {
            showToast('No more tests to show', 'error');
        }

        setIsLoading(false);
    }

    return (
        <>
            <header className="w-full flex flex-row flex-wrap items-center justify-between gap-6 pb-10">
                <h1 className="text-3xl font-bold">My Tests</h1>
                {
                    hasTests &&
                    <div className="w-fit flex flex-row gap-5 flex-wrap md:flex-nowrap">
                        <div className="min-w-80 flex-1 flex flex-row gap-5 items-center">
                            <SearchBar
                                placeholder="Search by name or topic"
                                onSearch={handleSearch}
                            />
                            <DateSortSelect
                                onSort={handleDateSort}
                            />
                        </div>
                        <div className="flex flex-row gap-5">
                            <GenerateTestDialog 
                                adaptationList={adaptationList}
                                topicList={topicList}
                                onGenerate={handleCreateTemplate}
                            />
                            <TemplateDialog 
                                type="create"
                                topics={topicList}
                                onCreate={handleCreateTemplate}
                            />
                        </div>
                    </div>
                }
            </header>
            <section className={`w-full flex flex-col @container ${!hasTests && 'h-full items-center'}`}>
                {
                    !hasTests
                    ? <div className="h-full flex flex-col justify-center gap-5">
                            <span className="text-2xl text-center">
                                Start creating a Test!
                            </span>
                            <div className="flex flex-row gap-3">
                                <GenerateTestDialog 
                                    adaptationList={adaptationList}
                                    topicList={topicList}
                                    onGenerate={handleCreateTemplate}
                                />
                                <TemplateDialog 
                                    type="create"
                                    topics={topicList}
                                    onCreate={handleCreateTemplate}
                                />
                            </div>
                        </div>
                    : <ul className="flex-1 flex flex-row flex-wrap gap-10 sm:gap-20 justify-center @3xl:justify-start">
                        {
                            templates && visibleTemplates.map((t) => (
                                <li key={t.id}>
                                    <TemplateCard
                                        key={t.id}
                                        test={t}
                                        topics={topicList}
                                        onDelete={handleDeleteTemplate}
                                        onUpdate={handleUpdateTemplate}
                                    />
                                </li>
                            ))
                        }
                        {
                            templates && visibleTemplates.length === 0 &&
                            <p className="text-xl text-center w-full pt-20">
                                No tests found..
                            </p>
                        }
                    </ul>
                }
            </section>
            {
                (hasTests && templates.length >= 6) && (
                    <footer className="w-full mt-auto pt-15 flex flex-row items-center justify-center">
                        <Button
                            onClick={handleFetchTemplates}
                            variant={'outline'}
                            disabled={isloading}
                            className="w-fit min-w-13 text-[17px] p-6 rounded-2xl flex flex-row gap-4 items-center"
                        >
                            {
                                isloading
                                ? <>
                                    <LoaderCircle className="animate-spin" />
                                    Loading..
                                    </>
                                : <Ellipsis />
                            }
                        </Button>
                    </footer>
                )
            }
        </>
    )
}
