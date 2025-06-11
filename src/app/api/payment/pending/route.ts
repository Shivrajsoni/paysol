import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recipient's public key from query params
    const { searchParams } = new URL(request.url);
    const recipientPublicKey = searchParams.get("recipientPublicKey");

    if (!recipientPublicKey) {
      return NextResponse.json(
        { error: "Recipient public key is required" },
        { status: 400 }
      );
    }

    // Fetch pending payment requests
    const pendingPayments = await Prisma.payment_Pending.findMany({
      where: {
        recipientPublicKey,
        is_completed: false,
      },
      include: {
        sender: {
          select: {
            username: true,
            PublicKey: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Pending payments fetched successfully",
      data: pendingPayments,
    });
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
