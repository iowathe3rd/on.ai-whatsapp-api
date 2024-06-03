-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'INTERACTIVE', 'DOCUMENT', 'AUDIO', 'STICKER', 'ORDER', 'VIDEO', 'BUTTON', 'CONTACTS', 'LOCATION', 'UNKNOWN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Sent', 'Delivered', 'Read');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('Client', 'Me');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "wa_id" TEXT NOT NULL,
    "from" TEXT,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" JSONB NOT NULL,
    "chatId" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "status" "Status" NOT NULL,
    "readAt" TIMESTAMP(3),
    "messageContextId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageContext" (
    "id" TEXT NOT NULL,
    "forwarder" BOOLEAN NOT NULL,
    "frequently_forwarded" BOOLEAN NOT NULL,
    "from" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "wa_id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "avatar" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_wa_id_key" ON "Message"("wa_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_contactId_key" ON "Chat"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_wa_id_key" ON "Contact"("wa_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_messageContextId_fkey" FOREIGN KEY ("messageContextId") REFERENCES "MessageContext"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
