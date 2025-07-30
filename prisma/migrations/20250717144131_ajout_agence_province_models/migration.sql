/*
  Warnings:

  - Added the required column `agenceId` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "agenceId" INTEGER NOT NULL,
ADD COLUMN     "provinceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agence" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "codeAgence" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,

    CONSTRAINT "Agence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agence_codeAgence_key" ON "Agence"("codeAgence");

-- AddForeignKey
ALTER TABLE "Agence" ADD CONSTRAINT "Agence_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "Agence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
