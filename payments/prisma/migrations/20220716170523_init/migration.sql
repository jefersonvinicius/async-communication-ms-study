-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "credit_card" VARCHAR(255) NOT NULL,
    "security_number" VARCHAR(255) NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
