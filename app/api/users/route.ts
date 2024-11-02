// app/api/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure prisma is set up in your /lib folder

// GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, password, email, notes, phone, companyId } = data;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        email: email || null,
        notes: notes || null,
        phone: phone || null,
        companyId: companyId || null,
      },
    });
    console.log("User created:", newUser); // Logging the created user
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
