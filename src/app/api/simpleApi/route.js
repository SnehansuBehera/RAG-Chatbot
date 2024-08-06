
import { NextResponse } from "next/server";
export async function POST(req) {
    try {

        const { me } = await req.json();
        return NextResponse.json({ me });


    } catch (error) {
        return new NextResponse('Something Went wrong', { status: 500 });
    }
}