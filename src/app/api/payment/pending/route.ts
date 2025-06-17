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
            clerkId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enhance the response with usernames
    const enhancedPayments = pendingPayments.map((payment) => ({
      ...payment,
      sender: {
        ...payment.sender,
        username: payment.sender.username || "Unknown User",
      },
    }));

    return NextResponse.json({
      message: "Pending payments fetched successfully",
      data: enhancedPayments,
    });
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
