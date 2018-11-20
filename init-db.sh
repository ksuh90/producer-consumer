
# Delete and create initial database
echo "Deleting \"dev\" if already exists..."
curl http://admin:pass@localhost:5984/dev -X DELETE
echo "Creating new database \"dev\""
curl http://admin:pass@localhost:5984/dev -X PUT

# Dump initial db state
echo "Dumping data into database"
node_modules/.bin/couchrestore --url http://admin:pass@localhost:5984 --db dev < cloudant/transactions.txt

exit 0
