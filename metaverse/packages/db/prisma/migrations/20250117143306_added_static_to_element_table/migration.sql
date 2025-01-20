/*
  Warnings:

  - You are about to drop the column `imageURL` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `imageURL` on the `Element` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `static` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "imageURL",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "imageURL",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "static" BOOLEAN NOT NULL;
