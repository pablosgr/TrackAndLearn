import { getTestById } from "../actions";
import TestDetailClient from "./TestDetailClient";

export default async function TestsDetail({ params }: { params: { id: string } }) {
    const data = await params;
    const test = await getTestById(data.id);

    return (
        <TestDetailClient test={test}/>
    )
}
