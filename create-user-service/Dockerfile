FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 6000

CMD [ "npm", "run", "start:dev" ]
# CMD sh -c "npm run migration:run && npm run start:dev"
