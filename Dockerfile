FROM node:16-alpine3.11 as front
COPY ["client", "client/"]
WORKDIR "/client"
RUN npm run build
RUN ls /client

FROM python:3.7.9-alpine
COPY ["server", "server/"]
COPY --from=front /client /client
WORKDIR "/server"
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo
RUN apk add --update --no-cache g++ gcc libxslt-dev
RUN apk --no-cache add make bash npm dos2unix
RUN pip install -r requirements.txt
CMD /bin/bash ./run.sh