import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";

interface UpdatePaymentRequest {
  recipientPublicKey: string;
  senderPublicKey: string;
  amount: string;
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
    const {
      recipientPublicKey,
      senderPublicKey,
      amount,
    }: UpdatePaymentRequest = body;

    // Validate required fields
    if (!recipientPublicKey || !senderPublicKey || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find and update the payment request
    const updatedPayment = await Prisma.payment_Pending.updateMany({
      where: {
        recipientPublicKey,
        sender: {
          PublicKey: senderPublicKey,
        },
        amount,
        is_completed: false,
      },
      data: {
        is_completed: true,
      },
    });

    if (updatedPayment.count === 0) {
      return NextResponse.json(
        { error: "No matching payment request found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Payment status updated successfully",
        data: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
