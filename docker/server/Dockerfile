FROM python:3.7.9-alpine

WORKDIR /mash-app
ADD ./server/requirements.txt /mash-app/server/

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo
RUN apk add --update --no-cache g++ gcc libxslt-dev
RUN apk --no-cache add make bash npm
RUN pip install -r server/requirements.txt

ADD ./docker /mash-app/docker
ADD ./server /mash-app/server