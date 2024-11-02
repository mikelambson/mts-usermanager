// app/api/companies/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch a single company by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

// PUT: Update a company by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const data = await request.json();
    const { name, address, phone, email, notes, primaryContact } = data;

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: { name, address, phone, email, notes, primaryContact },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a company by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
