FROM node:alpine

EXPOSE 8000 9929 9230

RUN \
  apk add --no-cache python make g++ && \
  apk add vips-dev fftw-dev --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main && \
  rm -fR /var/cache/apk/*

RUN npm install -g gatsby-cli

WORKDIR /app
COPY ./package.json .
COPY . .
RUN rm -r ./node_modules
RUN yarn install && yarn cache clean
CMD ["yarn", "develop", "-H", "0.0.0.0" ]