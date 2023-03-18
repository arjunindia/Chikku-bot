# docker image for building and starting the app. npm run build is run in the image
FROM nikolaik/python-nodejs:latest
RUN mkdir -p /home/pn/app/node_modules && chown -R pn:pn /home/pn/app
WORKDIR /home/pn/app
COPY --chown=pn:pn package*.json ./
USER pn
RUN npm install
COPY --chown=pn:pn . .
RUN npm run build
CMD npm run start