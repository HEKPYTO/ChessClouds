#!/bin/bash
set -x
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
docker pull ${websocket_image}
docker run -d -p 80:8000 -e DATABASE_URL="${database_url}" ${websocket_image}

