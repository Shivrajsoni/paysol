import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";

interface RequestProps {
  requestedPublicKey: string;
  amount: string;
  description: string;
  senderId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { requestedPublicKey, amount, description, senderId }: RequestProps =
      body;

    // Validate required fields
    if (!requestedPublicKey || !amount || !senderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Find the sender user
    const sender = await Prisma.user.findFirst({
      where: {
        clerkId: senderId,
      },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Create payment request
    const paymentRequest = await Prisma.payment_Pending.create({
      data: {
        senderId: sender.id,
        recipientPublicKey: requestedPublicKey,
        description: description || "",
        amount: amount,
        is_completed: false,
      },
    });

    return NextResponse.json(
      {
        message: "Payment request created successfully",
        data: paymentRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
