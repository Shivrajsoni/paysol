import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

// Input validation schema
const contactSchema = z.object({
  receiverPubkey: z.string().min(1, "Receiver public key is required"),
  receiverUsername: z.string().min(1, "Receiver username is required"),
  userId: z.string().min(1, "User ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { receiverPubkey, receiverUsername, userId } = validationResult.data;

    // Get user and check existence in a single query
    const user = await Prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use transaction to ensure data consistency
    const result = await Prisma.$transaction(async (tx) => {
      // Check for existing contact
      const existingContact = await tx.contacts.findFirst({
        where: {
          AND: [{ addedById: user.id }, { PublicKey: receiverPubkey }],
        },
      });

      if (existingContact) {
        return {
          success: true,
          message: "Contact already exists",
          contact: existingContact,
        };
      }

      // Create new contact
      const newContact = await tx.contacts.create({
        data: {
          username: receiverUsername,
          PublicKey: receiverPubkey,
          addedById: user.id,
        },
      });

      // Get updated contacts list
      const updatedContacts = await tx.contacts.findMany({
        where: { addedById: user.id },
        orderBy: { createdAt: "desc" },
      });

      return {
        success: true,
        message: "Contact created successfully",
        contacts: updatedContacts,
      };
    });

    return NextResponse.json(result, {
      status: result.contact ? 200 : 201,
    });
  } catch (error) {
    console.error("Error in contact creation:", error);

    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: "Database operation failed",
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
