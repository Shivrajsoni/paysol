import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "../../../../../prisma";

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "7");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count of matching contacts
    const totalContacts = await Prisma.contacts.count({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { PublicKey: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalContacts / limit);

    // Fetch paginated search results
    const contacts = await Prisma.contacts.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { PublicKey: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({
      contacts,
      totalContacts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return NextResponse.json(
      { error: "Failed to search contacts" },
      { status: 500 }
    );
  }
}
