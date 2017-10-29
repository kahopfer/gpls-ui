#!/usr/bin/env bash
ng build --prod
docker build -t gpls-ui:v0.1.0 .
docker save -o /Users/kylehopfer/Desktop/gpls-ui.tar.gz gpls-ui

# Local
#docker run --restart=always --name gpls-ui -p 4200:80 -d gpls-ui:v0.1.0

# Server
#docker run --restart=always --name gpls-ui -p 80:80 -d gpls-ui:v0.1.0
