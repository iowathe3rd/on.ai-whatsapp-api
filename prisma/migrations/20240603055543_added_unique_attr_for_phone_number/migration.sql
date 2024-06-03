/*
  Warnings:

  - A unique constraint covering the columns `[wa_id,phoneNumber]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contact_wa_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_wa_id_phoneNumber_key" ON "Contact"("wa_id", "phoneNumber");
