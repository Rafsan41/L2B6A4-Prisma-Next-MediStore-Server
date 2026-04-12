-- CreateTable
CREATE TABLE "seller_reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "seller_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seller_reviews_sellerId_idx" ON "seller_reviews"("sellerId");

-- CreateIndex
CREATE INDEX "seller_reviews_rating_idx" ON "seller_reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "seller_reviews_customerId_sellerId_key" ON "seller_reviews"("customerId", "sellerId");

-- AddForeignKey
ALTER TABLE "seller_reviews" ADD CONSTRAINT "seller_reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_reviews" ADD CONSTRAINT "seller_reviews_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_reviews" ADD CONSTRAINT "seller_reviews_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "seller_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
