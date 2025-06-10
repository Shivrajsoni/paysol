import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../../prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiverPubkey, receiverUsername, userId } = body;

    // First, verify that the user exists and get their database id
    const user = await Prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if contact already exists
    const existingContact = await Prisma.contacts.findFirst({
      where: {
        AND: [
          { addedById: user.id }, // Use the database id here
          { PublicKey: receiverPubkey },
        ],
      },
    });

    if (existingContact) {
      return NextResponse.json(
        { message: "Contact already exists", contact: existingContact },
        { status: 200 }
      );
    }

    // Create new contact using the user's database id
    const user_contact = await Prisma.contacts.create({
      data: {
        username: receiverUsername,
        PublicKey: receiverPubkey,
        addedById: user.id, // Use the database id here
      },
    });

    // Get all contacts for this user, sorted by createdAt in descending order
    const allContacts = await Prisma.contacts.findMany({
      where: {
        addedById: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "User Contact created successfully",
        contacts: allContacts,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Error creating contact" },
      { status: 500 }
    );
  }
}
