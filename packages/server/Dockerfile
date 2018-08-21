# use node 8 (current LTS).
FROM node:8-alpine

# add directories.
ADD bin /var/www/app/bin
ADD dist /var/www/app/dist
# add package.json and package-lock.json
ADD package.json /var/www/app/package.json
ADD package-lock.json /var/www/app/package-lock.json

# run install from the main app directory.
RUN cd /var/www/app && \
    npm install

# work dir.
WORKDIR /var/www/app

# start command.
CMD [ "node", "/var/www/app/bin/www" ]

# expose port.
EXPOSE 3000