FROM node:24-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN apt-get update -y && apt-get install -y postgresql-client
RUN npm run build
EXPOSE 3000
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh
CMD ["/usr/src/app/entrypoint.sh"]