const eventEmitter = require('events');
const producer = require('./producer');
const server = require('./server');

// The event emitter for toggling producer.
const ee = new eventEmitter();

// Event listener for toggling the producer on/off
ee.on('toggle', function (mode) {
    let globalMode = parseInt(process.env.PRODUCER_MODE);
    switch(mode) {
        case 1:
            console.log('toggle ON');
            if (!globalMode) {
                process.env.PRODUCER_MODE = 1;
                producer.produce();
            }
            break;
        default:
            console.log('toggle OFF');
            if (globalMode) {
                process.env.PRODUCER_MODE = 0;
            }
            break;
    }
});

const httpServer = server(ee);
httpServer.listen(8125);

// Start producing
producer.produce();
