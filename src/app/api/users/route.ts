import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, publicKey, username } = body;

    // checking if user already exist
    const user_exist = await prisma.user.findFirst({
      where: {
        clerkId: clerkId,
      },
    });

    if (user_exist) {
      console.log("User exists already in database");
      return NextResponse.json(
        {
          msg: "User has been created earlier",
          user: user_exist,
        },
        { status: 200 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username: username || null,
        PublicKey: publicKey || null,
        clerkId: clerkId || null,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
