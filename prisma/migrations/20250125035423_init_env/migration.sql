-- CreateEnum
CREATE TYPE "platform" AS ENUM ('comfyui', 'webui');

-- CreateEnum
CREATE TYPE "env_action" AS ENUM ('download', 'git', 'shell');

-- CreateTable
CREATE TABLE "env" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "platform" "platform" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "env_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "env_variable" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "action" "env_action" NOT NULL,
    "value" TEXT NOT NULL,
    "value1" TEXT,
    "value2" TEXT,
    "value3" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "env_id" INTEGER NOT NULL,

    CONSTRAINT "env_variable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "env_variable" ADD CONSTRAINT "env_variable_env_id_fkey" FOREIGN KEY ("env_id") REFERENCES "env"("id") ON DELETE CASCADE ON UPDATE CASCADE;
