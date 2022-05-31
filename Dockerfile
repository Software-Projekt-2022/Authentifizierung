FROM node:16-alpine

ENV DB_HOST="localhost"
ENV DB_PORT="3306"
ENV DB_NAME="Authentification"
ENV DB_USER=
ENV DB_PASS=

ENV SERVER_HOST="localhost"
ENV SERVER_PORT="80"

ENV JWT_PRIVATE_KEY_PATH="./id_rsa.pem"
ENV JWT_PUBLIC_KEY_PATH="./id_rsa_pub.pem"

ENV NODE_ENV="production"

EXPOSE ${SERVER_PORT}

WORKDIR /Authentification

COPY . .

RUN npm install

ENTRYPOINT ["npm", "start"]
