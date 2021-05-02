var app = require('express')();
let dotenv = require('dotenv');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { Client } = require("cassandra-driver");
 
dotenv.config({ path: '.env' }); 

const PORT = 8080;
const client = new Client({
    cloud: {
      secureConnectBundle: "secure-connect-gcp2021.zip",
    },
    credentials: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
});

var STATIC_CHANNELS = [{
    name: 'Turbo Pottery 101',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Origami with Egg',
    participants: 0,
    id: 2,
    sockets: []
}];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => { 
    console.log(`new client connected`);
    socket.emit('connection', null);
    socket.on('channel-join', id => {
        console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });
    socket.on('send-message', message => {
        console.log(message);
        io.emit('message', message);
        client.connect()
        .then(function () {
            const query = `INSERT INTO messages.msg (id, channel, msg, sender) VALUES (?,?,?,?)`;
            const params = [message.id, message.channel_id, message.text, message.senderName];
            return client.execute(query, params, { prepare: true});
        });
        // console.log(`Your cluster returned ${rs.rowLength} row(s)`);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});

client.shutdown();

/**
 * @description This method retrieves the static channels
 */
app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});
