-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "lastMessageTimestamp" TIMESTAMP(3),
ADD COLUMN     "unreadCountReceiver" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unreadCountSender" INTEGER NOT NULL DEFAULT 0;
