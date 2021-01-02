FROM node:12.19.0

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]