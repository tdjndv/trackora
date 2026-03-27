-- AlterTable
ALTER TABLE "users" ADD COLUMN     "most_recent_account_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_most_recent_account_id_fkey" FOREIGN KEY ("most_recent_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
