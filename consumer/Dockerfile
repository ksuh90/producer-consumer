FROM node:8

ENV PROJECT_ROOT /opt/app

RUN apt-get update \
  && apt-get install -y vim \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pm2

RUN mkdir -p /tmp/app

COPY package.json /tmp/app/
COPY package.json /opt/app/

COPY package-lock.json /tmp/app/
COPY package-lock.json /opt/app/

RUN cd /tmp/app/ && npm install

WORKDIR $PROJECT_ROOT

COPY app.json /opt/app/
COPY index.js /opt/app/
COPY index.html /opt/app/
COPY lib /opt/app/lib

COPY bin /opt/bin

RUN ["chmod", "+x", "/opt/bin/start.sh"]

CMD ["/opt/bin/start.sh"]
