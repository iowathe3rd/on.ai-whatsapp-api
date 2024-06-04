/*
  Warnings:

  - The values [Inbound,Outbound] on the enum `Direction` will be removed. If these variants are still used in the database, this will fail.
  - The values [TEXT,IMAGE,INTERACTIVE,DOCUMENT,AUDIO,STICKER,ORDER,VIDEO,BUTTON,CONTACTS,LOCATION,UNKNOWN,SYSTEM] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Sent,Delivered,Read] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Direction_new" AS ENUM ('inbound', 'outbound');
ALTER TABLE "Message" ALTER COLUMN "direction" TYPE "Direction_new" USING ("direction"::text::"Direction_new");
ALTER TYPE "Direction" RENAME TO "Direction_old";
ALTER TYPE "Direction_new" RENAME TO "Direction";
DROP TYPE "Direction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('text', 'image', 'interactive', 'document', 'audio', 'sticker', 'order', 'video', 'button', 'contacts', 'location', 'unknown', 'system');
ALTER TABLE "Message" ALTER COLUMN "type" TYPE "MessageType_new" USING ("type"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('sent', 'delivered', 'read');
ALTER TABLE "MessageContext" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MessageContext" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "MessageContext" ALTER COLUMN "status" SET DEFAULT 'sent';
COMMIT;

-- AlterTable
ALTER TABLE "MessageContext" ALTER COLUMN "status" SET DEFAULT 'sent';
