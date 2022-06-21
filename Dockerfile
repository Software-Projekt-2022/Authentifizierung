FROM node:16-alpine

ENV DB_HOST="authdb"
ENV DB_PORT="3306"
ENV DB_NAME="auth"
ENV DB_USER=auth
ENV DB_PASS=authdbpw1234

ENV RABBITMQ_HOST="rabbitmq"
ENV RABBITMQ_PORT="5672"

ENV SERVER_HOST="authentifizierung"
ENV SERVER_PORT="80"

ENV JWT_PRIVATE_KEY_PATH="./id_rsa.pem"
ENV JWT_PUBLIC_KEY_PATH="./id_rsa_pub.pem"

ENV NODE_ENV="production"

EXPOSE ${SERVER_PORT}

WORKDIR /Authentification

COPY . .

RUN echo $(ls)
RUN npm install
ENTRYPOINT ["npm", "start"]
