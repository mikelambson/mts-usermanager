// app/api/companies/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const companies = (await prisma.company.findMany()) || [];
    console.log("Companies fetched:", companies);
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch companies",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: Create a new company
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, address, phone, email, notes, primaryContact } = data;

    const newCompany = await prisma.company.create({
      data: { name, address, phone, email, notes, primaryContact },
    });

    return NextResponse.json(newCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
