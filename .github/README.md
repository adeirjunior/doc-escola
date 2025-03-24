# 📘 Sistema de Armazenamento de Matrículas Escolares

Este é um software desenvolvido com Next.js, Prisma, Tailwind CSS e NextAuth para armazenar documentos de matrículas escolares de diferentes escolas de um município.

## 🚀 Tecnologias Utilizadas

- **Next.js** - Framework React para desenvolvimento web
- **Prisma** - ORM para interação com o banco de dados MySQL
- **Tailwind CSS** - Framework de estilização
- **NextAuth** - Autenticação segura para usuários
- **Docker** - Para containerização do frontend

## 📂 Estrutura do Banco de Dados

O projeto utiliza um banco de dados MySQL com as seguintes tabelas principais:

- **Aluno**: Representa os alunos matriculados e seus responsáveis
- **Documento**: Armazena os documentos de matrícula associados aos alunos e escolas
- **Escola**: Representa as instituições de ensino
- **Usuário**: Responsável por gerenciar os dados do sistema

## 📦 Como Rodar o Projeto

### 🛠️ Rodando Localmente
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente (`.env`)
  
4. Execute as migrações do banco de dados:
   ```bash
   npx prisma db push
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

### 🐳 Rodando com Docker
Para rodar o projeto com Docker:
```bash
docker build -t doc-escola .
docker run -p 3000:3000 --env-file .env doc-escola
```

## 📜 Licença
Este projeto é distribuído sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo conforme necessário.

