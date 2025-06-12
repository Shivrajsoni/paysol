import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface TransactionRequest {
  signature: string;
  from: string;
  to: string;
  amount: string;
  priorityFee?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: TransactionRequest = await req.json();
    const { signature, from, to, amount, priorityFee } = body;

    if (!signature || !from || !to || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user by clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: session.userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        signature,
        from,
        to,
        amount,
        priorityFee: priorityFee || "disabled", // Default to disabled if not provided
        userId: dbUser.id,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error storing transaction:", error);
    return NextResponse.json(
      { error: "Failed to store transaction" },
      { status: 500 }
    );
  }
}
