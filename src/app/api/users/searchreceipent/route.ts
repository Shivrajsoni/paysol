import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "../../../../../prisma";
import { getCachedUsername, setCachedUsername } from "@/lib/redis";

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

    // First, check Redis cache
    const cachedUsername = await getCachedUsername(sanitizedQuery);
    if (cachedUsername) {
      return NextResponse.json({
        contacts: [
          {
            id: "cached",
            username: cachedUsername,
            PublicKey: sanitizedQuery,
          },
        ],
      });
    }

    // If not in cache, query the database
    const user = await Prisma.user.findFirst({
      where: {
        clerkId: session.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Search for contacts with matching public key
    const contact = await Prisma.contacts.findFirst({
      where: {
        addedById: user.id,
        PublicKey: sanitizedQuery,
      },
      select: {
        id: true,
        username: true,
        PublicKey: true,
      },
    });

    // If contact found, cache it and return
    if (contact) {
      // Cache the result for future lookups
      await setCachedUsername(contact.PublicKey, contact.username);
      return NextResponse.json({
        contacts: [contact],
      });
    }

    // If no contact found, return empty array
    return NextResponse.json({ contacts: [] });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
