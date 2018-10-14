FROM alpine:3.7

RUN apk add --no-cache curl

COPY load.sh /src/load.sh

RUN chmod +x /src/load.sh

ENTRYPOINT ["/bin/sh", "/src/load.sh"]
