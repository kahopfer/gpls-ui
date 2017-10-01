#!/usr/bin/env bash
ng build --prod
docker build -t gpls-ui:v0.1.0 .
docker run --restart=always --name gpls-ui -p 4200:80 -d gpls-ui:v0.1.0
