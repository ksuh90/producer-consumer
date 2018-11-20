
# Delete and create initial database
curl http://admin:pass@localhost:5984/dev -X DELETE
curl http://admin:pass@localhost:5984/dev -X PUT

# Dump initial db state
node_modules/.bin/couchrestore --url http://admin:pass@localhost:5984 --db dev < cloudant/transactions.txt

exit 0
