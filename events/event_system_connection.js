const amqp = require('amqplib/callback_api');
const constants = require('./event_system_constants');

var amqp_connection = null;
var amqp_channel = null;

function connect(done, onError)
{
    const conn_url = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    console.log(
        `Connecting to RabbitMQ with the following information:
          Host: ${conn_url}`);
          
    amqp.connect(conn_url, (conn_err, connection) =>
    {
        if (conn_err)
        {
            onError(conn_err);
            return;
        }
        
        amqp_connection = connection;

        // Close callback. Set connection to null if disconnected
        connection.on('close', () =>
        {
            console.log('RabbitMQ connection lost');
            amqp_connection = null;
        });

        connection.createChannel((ch_err, channel) =>
        {
            if (ch_err)
            {
                connection.close();
                connection = null;
                onError(ch_err);
                return;
            }
            
            amqp_channel = channel;
            done();
        });
    });
}

function sendEvent(event)
{
    return new Promise((resolve, reject) =>
    {
        var msg = JSON.stringify(event);

        // Send event function
        const send = () =>
        {
            amqp_channel.publish(constants.microservice_exchange, event.event_type, Buffer.from(msg));
            console.log('Sent event %s: "%s"', event.event_type, msg);
            resolve();
        };

        // Reconnect if not connected
        if(!amqp_connection || !amqp_channel)
        {
            connect(() =>
            {
                console.log('Connected to RabbitMQ');
                send();
            }, (err) =>
            {
                reject(err);
            });
        }
        else
        {
            send();
        }
    });
}

module.exports.sendEvent = sendEvent;
