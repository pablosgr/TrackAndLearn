import { aboutTexts } from "@/app/data/about";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AboutPage() {
    return (
        <>
            <header className="w-full flex flex-row items-center pb-10">
                <h1 className="text-3xl font-bold">About</h1>
            </header>
            <Accordion
                type="single"
                defaultValue={aboutTexts[0].title}
                className="w-full h-full px-5 md:px-[20%]"
            >
                {
                    aboutTexts.map((item, index) => (
                        <AccordionItem key={index} value={item.title} >
                            <AccordionTrigger className="text-lg font-bold w-full hover:cursor-pointer">
                                {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-[16px] w-full">
                                {item.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))
                }
            </Accordion>
        </>
    )
}
