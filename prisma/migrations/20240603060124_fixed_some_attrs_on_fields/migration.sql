/*
  Warnings:

  - A unique constraint covering the columns `[wa_id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wa_id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contact_wa_id_phoneNumber_key";

-- DropIndex
DROP INDEX "Message_wa_id_chatId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_wa_id_key" ON "Contact"("wa_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phoneNumber_key" ON "Contact"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Message_wa_id_key" ON "Message"("wa_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_chatId_key" ON "Message"("chatId");
