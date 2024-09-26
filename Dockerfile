# Use a imagem base do Node.js
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json (ou yarn.lock) para instalar as dependências
COPY package*.json ./

# Instale as dependências
RUN npm install --legacy-peer-deps

# Copie todo o diretório do projeto
COPY . .

ENV NODE_ENV=production
ENV DATABASE_URL=mysql://root@host.docker.internal:3306/doc_escola
ENV AUTH_SECRET=18171157e3edac7d477b3f34602e5afa
ENV NEXTAUTH_URL=http://localhost:3000
ENV PORT=3000

# Execute o build do Next.js
RUN npx prisma db push && npm run build

# Exponha a porta que o aplicativo Next.js irá rodar
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
