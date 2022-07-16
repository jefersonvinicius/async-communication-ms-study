#!/bin/bash

docker run --rm -d --hostname my-rabbit -p 5672:5672 --name some-rabbit rabbitmq:3.10.6