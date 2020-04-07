var amqp = require('amqplib/callback_api');
const request = require('request')
const CONN_URL = 'amqp://guest:guest@localhost';
var amqpConn, ch = null;


amqp.connect(CONN_URL, function(err, connection) {
    if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(start, 1000);
      }

      amqpConn = connection;

      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        ch = channel;
        var queue = 'hello';
        var msg = 'Hello world';
    
        channel.assertQueue(queue, {
          durable: false
        });
    
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      });
  
});

setInterval(function() {
    // publish("", "jobs", new Buffer("work work work"));


    request.get({
        url: 'http://localhost:3000/',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDkxZmQxMzE4NWRlYzVlMDJhNThiNTUiLCJlbWFpbCI6ImFkbWluQHJjYy5jb20iLCJuYW1lIjoiUmNjIEFkbWluIiwicGxhdGZvcm0iOiIxIiwic2FsdCI6IjQzN2Q3MmFlNDdiMzQ1NTMwOWQxMTAzODI1YzA2ZDBjIiwiYWNjb3VudExldmVsIjoiYWRtaW4iLCJhZG1pblR5cGUiOiJzdXBlciIsImNyZWF0ZWQiOjE1Njk4NDg1OTU1NTQsImlhdCI6MTU4NDg5NzY5MywiZXhwIjoxNjAwNDQ5NjkzfQ.seti_8uBlH4iW1-R7J3gAN5UQYGCa0821SFqOHGQcIw",
            "api_key": "1234"
        },
        json: {
            "title": "string",
            "newspostState": "draft",
            "featureImage": "string",
            "excerpt": "string",
            "content": "string",
            "publishDate": "2020-03-20"
        }
    } , (error, res, body) => {
        if (error) {
            console.error(error)
            return
        }
        

        console.log("### 1");
        // Connect to the server and wait for the queue
        amqp.connect('amqp://localhost', (err, conn) => {
            conn.createChannel((err, ch) => {
              var q = 'hello';
              ch.assertQueue(q, {
                  durable: false
              });
              console.log("### 2",' [*] Waiting for messages in %s. To exit press CTRL+C', q);
              ch.consume(q, msg => {
                  console.log("### 3",' [x] Received %s', msg.content);  
                  conn.close();            
              }, {
                  noAck: true
              });
            });
        });
    })
}, 1000);