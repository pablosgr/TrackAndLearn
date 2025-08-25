'use client';

import Link from "next/link";
import { Search, BookOpenText, School } from "lucide-react";
import { useUser } from "@/components/context/userWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const buttons = [
  {
    role: 'teacher',
    url: '/tests',
    title: 'Manage Tests',
    description: 'Create and manage assessments',
    icon: BookOpenText
  },
  {
    role: 'teacher',
    url: '/classrooms',
    title: 'Explore Classrooms',
    description: 'Organize your students',
    icon: School
  },
  {
    role: 'student',
    url: '/classrooms',
    title: 'Explore Classrooms',
    description: 'Access your groups & tests',
    icon: School
  }
]

export default function Dashboard() {
  const {user} = useUser();

  return (
    <div className="w-full h-full flex flex-row pt-10 sm:p-10 gap-6">
      <section className="flex flex-col xl:flex-row gap-15 xl:gap-25">
        <div className="flex flex-col gap-6 justify-center">
          <h2 className="text-5xl font-bold">Welcome, {user.username}!</h2>
          <p className="text-3xl">
            {
              user.role === 'teacher'
              ? 'Monitor your students’ progress and support their learning path.'
              : 'Your knowledge grows every time you practice — let’s begin!'
            }
          </p>
          <Link href={'/about'}>
            <Button
              variant={'outline'}
              className={`
                h-fit w-fit
                flex flex-row gap-3 items-center
                py-3 px-5! rounded-2xl
                text-xl text-primary dark:text-white/80
                border-2 border-primary
                hover:bg-primary hover:text-white
                hover:drop-shadow-lg
              `}
            >
              <Search strokeWidth={3}/>
              Learn more about our platform
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-7 justify-center">
          {
            buttons.map((item, index) => {
              if (item.role !== user.role) return null;

              return (
                <Link href={`${item.url}`} key={index}>
                  <Card
                    className={`
                      min-w-50 sm:min-w-120 w-full flex-row
                      gap-3 p-8 hover:cursor-pointer hover:scale-105
                      hover:shadow-[0px_10px_17px_0_rgba(0,0,0,0.2)]
                      transition-all duration-300 rounded-2xl
                    `}>
                    <div className="flex flex-col justify-center">
                      <div className="w-fit h-fit p-5 rounded-full bg-primary/30">
                        <item.icon size={40}/>
                      </div>
                    </div>
                    <div className="w-full">
                      <CardHeader className="pt-0">
                        <CardTitle className="text-3xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl">{item.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )
            })
          }
        </div>
      </section>
    </div>
  )
}
