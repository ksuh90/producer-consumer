const amqp = require('amqplib');

const rand = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const producer = async function(){
    const connection = await amqp.connect('amqp://neat-back_rabbitmq_1');
    const channel = await connection.createChannel();

    var q = 'hello';
    var ok = await channel.assertQueue(q, { durable: false });
    
    var msg = 'Hello World!';

    await channel.sendToQueue(q, Buffer.from(msg));
    console.log(" [x] Sent '%s'", msg);
    channel.close();
    //connection.close();
}

producer();
