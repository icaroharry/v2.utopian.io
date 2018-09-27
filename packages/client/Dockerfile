FROM node:8.12-alpine
ADD . /opt/utopian
WORKDIR /opt/utopian
RUN yarn
RUN yarn run build
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime","./dist/ssr-mat/index.js", "-i", "max"]
