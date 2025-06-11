import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "../../../../../prisma";

export async function GET(request: Request) {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Sanitize and validate query
    const sanitizedQuery = query.trim();
    if (sanitizedQuery.length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // First, get the user's database id
    const dbUser = await Prisma.user.findUnique({
      where: {
        clerkId: session.userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Search contacts
    const contacts = await Prisma.contacts.findMany({
      where: {
        AND: [
          { addedById: dbUser.id }, // Only search user's contacts
          {
            OR: [
              { username: { contains: sanitizedQuery, mode: "insensitive" } },
              { PublicKey: { contains: sanitizedQuery, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        PublicKey: true,
        createdAt: true,
      },
      orderBy: {
        username: "asc",
      },
      take: 10, // Limit results to prevent overwhelming response
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
