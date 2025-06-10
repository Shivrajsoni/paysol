/*
  Warnings:

  - You are about to drop the column `contactId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_UserToContacts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `addedById` to the `Contacts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToContacts" DROP CONSTRAINT "_UserToContacts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToContacts" DROP CONSTRAINT "_UserToContacts_B_fkey";

-- AlterTable
ALTER TABLE "Contacts" ADD COLUMN     "addedById" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "contactId";

-- DropTable
DROP TABLE "_UserToContacts";

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
