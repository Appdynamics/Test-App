#!/bin/sh

docker pull jdbarfield/test-app-load
docker pull jdbarfield/test-nodejs-services
docker pull jdbarfield/test-java-services

docker tag jdbarfield/test-app-load app-load
docker tag jdbarfield/test-nodejs-services nodejs-services
docker tag jdbarfield/test-java-services java-services