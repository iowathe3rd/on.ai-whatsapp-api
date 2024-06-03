/*
  Warnings:

  - You are about to drop the column `chatId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `MessageContext` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropIndex
DROP INDEX "Message_chatId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatId",
DROP COLUMN "from",
DROP COLUMN "isDeleted",
ADD COLUMN     "contactId" TEXT;

-- AlterTable
ALTER TABLE "MessageContext" DROP COLUMN "from",
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ADD COLUMN     "isEdited" BOOLEAN DEFAULT false,
ALTER COLUMN "forwarder" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Sent';

-- DropTable
DROP TABLE "Chat";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
