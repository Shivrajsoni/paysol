import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "../../../../../prisma";
import { setCachedUsername } from "@/lib/redis";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user's database id
    const user = await Prisma.user.findFirst({
      where: {
        clerkId: session.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all contacts for the user
    const contacts = await Prisma.contacts.findMany({
      where: {
        addedById: user.id,
      },
      select: {
        id: true,
        username: true,
        PublicKey: true,
      },
    });

    // Cache all contacts in Redis
    await Promise.all(
      contacts.map((contact) =>
        setCachedUsername(contact.PublicKey, contact.username)
      )
    );

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
