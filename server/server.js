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

var STATIC_CHANNEL = [{
    name: 'Turbo Pottery 101',
    participants: 0,
    id: 1,
    sockets: []
},];

// CORS Headers
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
        var c = STATIC_CHANNEL[0];
        console.log(c)
        if (!c.sockets) {
            c.sockets = [socket.id]
        } else {
            c.sockets.push(socket.id);
        }
        c.participants++;
        io.emit('channel', c);
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
        var c = STATIC_CHANNEL[0];
        console.log(c.participants)
        let index = c.sockets.indexOf(socket.id);
        if (index != (-1)) {
            c.sockets.splice(index, 1);
            c.participants--;
            io.emit('channel', c);
        }
    });

});

client.shutdown();
