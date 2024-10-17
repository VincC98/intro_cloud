#!/bin/bash

#cat initiate.json

curl -X POST --data @test.json -H "Content-Type: application/json" http://admin:admin@192.168.56.102:3008/logs

