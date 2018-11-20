
# Install root level node packages
npm install

docker-compose up -d rabbitmq cloudant

# Run containers
docker-compose up --scale producer=3

exit 0
