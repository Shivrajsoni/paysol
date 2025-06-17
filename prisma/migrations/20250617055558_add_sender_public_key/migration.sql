/*
  Warnings:

  - Added the required column `senderPublicKey` to the `Payment_Pending` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment_Pending" ADD COLUMN     "senderPublicKey" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_Pending_senderPublicKey_idx" ON "Payment_Pending"("senderPublicKey");
