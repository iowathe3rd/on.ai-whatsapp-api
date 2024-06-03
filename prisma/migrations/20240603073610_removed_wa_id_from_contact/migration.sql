/*
  Warnings:

  - You are about to drop the column `wa_id` on the `Contact` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Contact_wa_id_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "wa_id";
