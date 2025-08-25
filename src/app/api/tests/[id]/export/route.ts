import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getTestsById } from "@/app/(protected)/tests/actions/get";
import { getTopicByTestId } from "@/app/(protected)/classrooms/actions/get";
import { TestType } from "@/types/test/TestType";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const testData: TestType[] = await getTestsById([id], 'test');
    const selectedTest: TestType = testData[0];

    if (!selectedTest) {
        return;
    }

    const topicName = await getTopicByTestId(selectedTest.id);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'track&learn';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Worksheet');

    const header = sheet.addRow(["Number", "Question", "Answer", "Topic"]);

    header.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF000000" } };
        cell.alignment = { horizontal: "left" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    selectedTest.question.forEach((q) => {
        const correctOption = q.option.find((o) => o.is_correct === true);
        const newRow = sheet.addRow([
            q.index_order,
            q.question_text,
            correctOption?.option_text,
            topicName
        ]);

        newRow.eachCell((c) => {
            c.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        })
    });

    sheet.getColumn(1).width = 10;
    sheet.getColumn(2).width = 70;
    sheet.getColumn(3).width = 60;
    sheet.getColumn(4).width = 20;

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
        headers: {
            "Content-Disposition": `attachment; filename="track&learn-test${id}.xlsx"`,
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
}
