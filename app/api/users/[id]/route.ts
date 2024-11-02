// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const data = await request.json();

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        password: data.password, // Ensure this is securely handled
        email: data.email || null,
        notes: data.notes || null,
        phone: data.phone || null,
        companyId: data.companyId || null,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
