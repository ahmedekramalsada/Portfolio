-- DropForeignKey
ALTER TABLE "AIConversation" DROP CONSTRAINT "AIConversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "AIMessage" DROP CONSTRAINT "AIMessage_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Embedding" DROP CONSTRAINT "Embedding_chunkId_fkey";

-- DropForeignKey
ALTER TABLE "KnowledgeChunk" DROP CONSTRAINT "KnowledgeChunk_documentId_fkey";

-- DropTable
DROP TABLE "AIConversation";

-- DropTable
DROP TABLE "AIMessage";

-- DropTable
DROP TABLE "Embedding";

-- DropTable
DROP TABLE "KnowledgeChunk";

-- DropTable
DROP TABLE "KnowledgeDocument";

-- DropTable
DROP TABLE "Prompt";

-- DropEnum
DROP TYPE "KnowledgeStatus";

