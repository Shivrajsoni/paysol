import { NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users with their usernames and public keys
    const users = await Prisma.user.findMany({
      select: {
        username: true,
        PublicKey: true,
      },
      where: {
        PublicKey: {
          not: null,
        },
        username: {
          not: null,
        },
      },
    });

    return NextResponse.json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
