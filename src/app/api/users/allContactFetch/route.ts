import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    // First, verify that the user exists and get their database id
    const user = await Prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //Get all Contact using the user's database id
    const user_contact = await Prisma.contacts.findMany({
      where: {
        addedById: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!user_contact || user_contact.length === 0) {
      return NextResponse.json(
        { message: "No contacts found" },
        { status: 200 }
      );
    }

    return NextResponse.json(user_contact, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Error fetching contacts" },
      { status: 500 }
    );
  }
}
