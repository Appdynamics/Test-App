#!/bin/sh

docker-compose -f /home/ravello/dynamicAttach/Test-App/docker-compose.yml down

docker-compose -f /home/ravello/dynamicAttach/Test-App/docker-compose.yml up -d
