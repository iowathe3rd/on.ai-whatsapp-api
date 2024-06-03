/*
  Warnings:

  - The values [Client,Me] on the enum `Direction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `avatar` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `frequently_forwarded` on the `MessageContext` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wa_id,chatId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `MessageContext` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Direction_new" AS ENUM ('Inbound', 'Outbound');
ALTER TABLE "Message" ALTER COLUMN "direction" TYPE "Direction_new" USING ("direction"::text::"Direction_new");
ALTER TYPE "Direction" RENAME TO "Direction_old";
ALTER TYPE "Direction_new" RENAME TO "Direction";
DROP TYPE "Direction_old";
COMMIT;

-- DropIndex
DROP INDEX "Message_wa_id_key";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "avatar",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "readAt",
DROP COLUMN "status",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MessageContext" DROP COLUMN "frequently_forwarded",
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "status" "Status" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_wa_id_chatId_key" ON "Message"("wa_id", "chatId");
