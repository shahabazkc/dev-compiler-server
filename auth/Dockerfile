FROM node:alpine

WORKDIR /user/src/app/dev-compiler-backend
COPY package.json .
RUN npm install
COPY . .

CMD ["npm","start"]