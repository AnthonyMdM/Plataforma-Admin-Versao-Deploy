/*
  Warnings:

  - You are about to alter the column `quantidade` on the `venda_produto` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Venda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Venda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Venda" ("data", "id", "userId") SELECT "data", "id", "userId" FROM "Venda";
DROP TABLE "Venda";
ALTER TABLE "new_Venda" RENAME TO "Venda";
CREATE TABLE "new_venda_produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produtoId" INTEGER NOT NULL,
    "vendaId" INTEGER NOT NULL,
    "quantidade" REAL NOT NULL,
    "preco_unitario" INTEGER NOT NULL,
    "preco_produto_totaltotal" INTEGER NOT NULL,
    CONSTRAINT "venda_produto_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "venda_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_venda_produto" ("id", "preco_produto_totaltotal", "preco_unitario", "produtoId", "quantidade", "vendaId") SELECT "id", "preco_produto_totaltotal", "preco_unitario", "produtoId", "quantidade", "vendaId" FROM "venda_produto";
DROP TABLE "venda_produto";
ALTER TABLE "new_venda_produto" RENAME TO "venda_produto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
