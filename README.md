# 🛍️ Plataforma de Administração de Vendas

![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748)
![Supabase](https://img.shields.io/badge/Supabase-OnlineDB-00ffcc)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📘 Sobre o Projeto

A **Plataforma de Administração de Vendas** é uma aplicação web desenvolvida com **Next.js**, **Tailwind CSS**, **Prisma ORM** e **Supabase**, projetada para facilitar o **controle e acompanhamento de vendas** em pequenos e médios negócios.

O sistema oferece uma **interface moderna e responsiva**, centralizando o gerenciamento de:

- 🧾 **Produtos** — cadastro, edição e exclusão de itens.
- 💰 **Vendas** — registro de vendas e visualização de histórico.
- 👥 **Clientes** — controle de informações e relacionamento.
- 📊 **Relatórios** — estatísticas e métricas de desempenho.

> 💡 O projeto ainda está em desenvolvimento e novas funcionalidades estão sendo implementadas continuamente.

---

## ⚙️ Tecnologias Utilizadas

| Tecnologia           | Descrição                                                     |
| -------------------- | ------------------------------------------------------------- |
| **Next.js 14**       | Framework React com renderização híbrida e ótima performance. |
| **Tailwind CSS 3.4** | Estilização moderna, responsiva e altamente customizável.     |
| **Prisma ORM**       | Mapeamento objeto-relacional para interação com o banco.      |
| **Supabase**         | Banco de dados online e backend como serviço (PostgreSQL).    |
| **TypeScript**       | Tipagem estática opcional para maior segurança no código.     |
| **Node.js**          | Ambiente de execução JavaScript no servidor.                  |

---

## 🧩 Estrutura do Projeto
```
Plataforma-Vendas/
├── prisma/              # Schema e migrações do banco de dados
├── src/
│   ├── app/            # Páginas e rotas do Next.js
│   ├── components/     # Componentes reutilizáveis
│   ├── lib/            # Configurações e utilitários
│   └── styles/         # Estilos globais
├── public/             # Imagens, diagramas, prévias
├── .env.local          # Variáveis de ambiente (Supabase)
└── package.json        # Dependências e scripts do projeto
```

---

## 🗃️ Modelo de Banco de Dados

O diagrama abaixo representa a estrutura do banco de dados hospedado na **Supabase**, incluindo tabelas, views e enum:

![Diagrama do Banco de Dados](./public/supabase.png)

### Tabelas Principais

- `User` — dados dos usuários/administradores.
- `Produto` — informações dos produtos cadastrados.
- `Venda` — registro das vendas realizadas.
- `venda_produto` — tabela de relacionamento entre vendas e produtos (muitos-para-muitos).

### Views

1. **ProdutosMaisVendidos**
   - `produtoId` (Int?)
   - `nome` (String?)
   - `unidadePesagem` (String?)
   - `total_vendido` (Float?)
   - `valor_total` (BigInt?)

2. **vendas_telas**
   - `id` (Int?)
   - `Name` (String?)
   - `data` (DateTime?)
   - `nome_produto` (String?)
   - `preco` (Int?)
   - `unidadePesagem` (String?)
   - `quantidade` (Float?)
   - `preco_produto_totaltotal` (Int?)

### Enum

- **Role**
  - `FUNCIONARIO`
  - `ADMINISTRADOR`

> Essas views e enum ajudam na organização de dados e na definição de permissões dentro do sistema.

---

## 💻 Como Executar Localmente

### 1. Clone o repositório
```bash
git clone https://github.com/AnthonyMdM/Plataforma-Admin.git
cd Plataforma-Admin
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configure o banco na Supabase e crie o arquivo `.env.local`
```env
# Chave secreta para proteger tokens e sessões
AUTH_SECRET="XXXXXXXXX"

# URL base do site ou aplicação
AUTH_URL="http://localhost:3000/"

# Conexão direta ao banco PostgreSQL na Supabase
DIRECT_URL="postgres://usuario:senha@endereco.supabase.co:5432/nome_do_banco"

# URL do banco da Supabase
DATABASE_URL="postgres://usuario:senha@endereco.supabase.co:5432/nome_do_banco"
```

### 4. Configuração do Prisma (`schema.prisma`)
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 5. Execute as migrações
```bash
npx prisma migrate dev
```

### 6. Inicie o servidor
```bash
npm run dev
```

Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido por [Anthony MdM](https://github.com/AnthonyMdM)**