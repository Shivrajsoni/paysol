/*
  Warnings:

  - You are about to drop the column `senderPublicKey` on the `Payment_Pending` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Payment_Pending` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment_Pending" DROP CONSTRAINT "Payment_Pending_recipientPublicKey_fkey";

-- DropForeignKey
ALTER TABLE "Payment_Pending" DROP CONSTRAINT "Payment_Pending_senderPublicKey_fkey";

-- DropIndex
DROP INDEX "User_PublicKey_key";

-- AlterTable
ALTER TABLE "Payment_Pending" DROP COLUMN "senderPublicKey",
ADD COLUMN     "senderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_Pending_senderId_idx" ON "Payment_Pending"("senderId");

-- CreateIndex
CREATE INDEX "Payment_Pending_recipientPublicKey_idx" ON "Payment_Pending"("recipientPublicKey");

-- CreateIndex
CREATE INDEX "User_PublicKey_idx" ON "User"("PublicKey");

-- AddForeignKey
ALTER TABLE "Payment_Pending" ADD CONSTRAINT "Payment_Pending_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
