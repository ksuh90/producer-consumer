# producer-consumer

## How to run
Prerequisite: Docker, docker-compsoe
1. Clone the repository 
    ```
    $ git clone https://github.com/ksuh90/producer-consumer.git
    ```
2. From the root of the repository, run ```sh start.sh```
3. Once all the containers are running, initialize the database with ```sh init-db.sh```

## Features
- Consumer UI is available at http://localhost:8080
- Producers ON: http://localhost:8080/on
- Producers OFF: http://localhost:8080/off
- Database UI (user: admin, pw: pass): http://localhost:5984/dashboard.html

## System flow
- Three producers each generate transactions of random amount(1~1000) and random users(tony, hulk, groot).
- Transactions are inserted to the database by the producers.
- The transaction entry is written to standard output and a file(transaction.log) in it's working directory.
- Transactions are sent to a queue(RabbitMQ) for the consumer to consume.
- The transaction entry is written to standard output and a file(transaction.log) in it's working directory.
- The consumer pushes the transaction data to the UI application for display.
- Producer ON/OFF is controlled by a configuration entry in the database in the form of ```{ mode: 1|0 }```. The producer determines on/off by reading this value. When turned off, transactions stop and queue channel is closed and recreated when turned back on.

## Specs

### - NodeJS
System is written in NodeJS.

### - RabbitMQ
A queueing system is used between producers and the consumer in order to display transactions sequentially by the consumer's UI.

### - Cloudant
Cloudant is used as the database. Cloudant is a fork of Apache's CouchDB. It is a nosql, JSON document-storage database.
#### Non-sequestial
Having multiple producers creating transactions simultaneously, it made sense going with a non-sequential structure for storing transactions in case of concurrent inserts. When a document(in our case, transaction data) is inserted to Cloudant, without a specified id, it is assigned a UUID instead of a sequential id, which eliminates the overhead of a queue in the database(e.g. Mysql).

#### MapReduce views for calculating balance
CouchDB contructs views via map-reduce functions which, for this assignment, is used to build an index for retrieving user balances. The view uses a built-in reduce function for calculating the sum of all transactions' amounts. Whenever we need to inquire the balance for a given user, we simply pass the userid when querying the view. It may seem plausible to have an entry for every user with a "balance" field. But when transactions are inserted concurrently, there is a high chance of error when updating the "balance" field. However, there are some limitations to this as well. When transactions are being added with a short time interval, as the size of the index grows, querying the accurate balance on the fly is quite challenging while the index is being updated in the background. Cloudant offers parameters for stale, after-update, etc, which have their own tradeoffs between accuracy and performance.