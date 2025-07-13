"use client"

import { addTopic, fetchTopics, deleteTopic } from "./actions/topic";
import { FormEvent, useRef, useState } from "react";

export default function Home() {
  const [topics, setTopics] = useState<{ id: number; name: string }[] | []>([]);
  const formRef = useRef<HTMLInputElement>(null);

  const onFetchClick = async () => {
    const data = await fetchTopics();
    setTopics(data);
  }

  const onDeleteClick = async (id: number) => {
    await deleteTopic(id);
    await onFetchClick();
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>  {
    e.preventDefault();
    if (formRef.current) {
      const newTopic = formRef.current.value;
      await addTopic(newTopic);
      formRef.current.value = "";
      await onFetchClick();
    }
  }
  
  return (
    <div className="flex flex-col justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {
        <button onClick={onFetchClick} >
          Fetch data
        </button>
      }
      {
        topics && topics.map((topic) => (
          <div key={topic.id} className="flex flex-col items-center justify-center gap-1">
            <h2 className="text-md font-bold">{topic.name}</h2>
            <button className="p-3 bg-black text-white rounded-lg hover:cursor-pointer" onClick={() => onDeleteClick(topic.id)}>Delete topic</button>
          </div>
        ))
      }
      <form action="" onSubmit={handleSubmit} className="flex flex-col justify-items-center w-1/3 self-center gap-3">
        <input type="text" ref={formRef} placeholder="Add new topic" className="p-2 border-1 border-gray-400"/>
        <button type="submit" className="p-2 bg-amber-400 text-white rounded-lg">Add</button>
      </form>
    </div>
  );
}
