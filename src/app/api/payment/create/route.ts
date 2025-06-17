import { NextRequest } from "next/server";
import { Prisma } from "../../../../../prisma";
import { auth } from "@clerk/nextjs/server";
import { paymentRequestSchema, validateRequest } from "@/lib/validation";
import { ApiError, handleApiError } from "@/lib/api-error";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { setCachedUsername } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return unauthorizedResponse();
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = await validateRequest(paymentRequestSchema, body);

    if (!validation.success) {
      return errorResponse(validation.error);
    }

    const { requestedPublicKey, amount, description, senderId } =
      validation.data;

    // Find the sender user
    const sender = await Prisma.user.findFirst({
      where: {
        clerkId: senderId,
      },
      select: {
        id: true,
        PublicKey: true,
        username: true,
      },
    });

    if (!sender) {
      throw ApiError.notFound("Sender not found");
    }

    if (!sender.PublicKey) {
      throw ApiError.badRequest("Sender's public key not found");
    }

    // Create payment request
    const paymentRequest = await Prisma.payment_Pending.create({
      data: {
        senderId: sender.id,
        senderPublicKey: sender.PublicKey,
        recipientPublicKey: requestedPublicKey,
        description: description || "",
        amount: amount,
        is_completed: false,
      },
    });

    // Cache the sender's username for future lookups
    if (sender.username) {
      await setCachedUsername(sender.PublicKey, sender.username);
    }

    return successResponse(
      {
        ...paymentRequest,
        sender: {
          username: sender.username,
          PublicKey: sender.PublicKey,
        },
      },
      "Payment request created successfully",
      201
    );
  } catch (error) {
    const { statusCode, message } = handleApiError(error);
    return errorResponse(message, statusCode);
  }
}
