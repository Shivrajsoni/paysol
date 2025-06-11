/*
  Warnings:

  - A unique constraint covering the columns `[PublicKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Payment_Pending" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderPublicKey" TEXT NOT NULL,
    "recipientPublicKey" TEXT NOT NULL,

    CONSTRAINT "Payment_Pending_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_PublicKey_key" ON "User"("PublicKey");

-- AddForeignKey
ALTER TABLE "Payment_Pending" ADD CONSTRAINT "Payment_Pending_senderPublicKey_fkey" FOREIGN KEY ("senderPublicKey") REFERENCES "User"("PublicKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment_Pending" ADD CONSTRAINT "Payment_Pending_recipientPublicKey_fkey" FOREIGN KEY ("recipientPublicKey") REFERENCES "User"("PublicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
