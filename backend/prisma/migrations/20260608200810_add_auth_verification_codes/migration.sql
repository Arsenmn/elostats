-- AlterTable
ALTER TABLE "user" ADD COLUMN "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "auth_verification_code" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "password_hash" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "user_id" TEXT,

    CONSTRAINT "auth_verification_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_verification_code_email_idx" ON "auth_verification_code"("email");

-- CreateIndex
CREATE INDEX "auth_verification_code_user_id_idx" ON "auth_verification_code"("user_id");

-- AddForeignKey
ALTER TABLE "auth_verification_code" ADD CONSTRAINT "auth_verification_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
