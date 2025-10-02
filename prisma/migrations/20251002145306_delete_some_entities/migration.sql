/*
  Warnings:

  - You are about to drop the column `addedBy` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the `CurrentStream` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CurrentStream" DROP CONSTRAINT "CurrentStream_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CurrentStream" DROP CONSTRAINT "CurrentStream_streamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Space" DROP CONSTRAINT "Space_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Stream" DROP CONSTRAINT "Stream_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."Stream" DROP CONSTRAINT "Stream_spaceId_fkey";

-- AlterTable
ALTER TABLE "public"."Stream" DROP COLUMN "addedBy",
DROP COLUMN "spaceId";

-- DropTable
DROP TABLE "public"."CurrentStream";

-- DropTable
DROP TABLE "public"."Space";
