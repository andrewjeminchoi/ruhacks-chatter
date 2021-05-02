const { Client } = require("cassandra-driver");
// dotenv.config({ path: '.env' }); 
const MAX_MSG = 10;

// async function run() {
//     const client = new Client({
//         cloud: {
//           secureConnectBundle: "secure-connect-gcp2021.zip",
//         },
//         credentials: {
//           username: "rcFJnnqsLaHNDwRnRhYCXshG",
//           password: "MBOX2yJLSg96JgWrsom8ThkYlGp8GyioTKe7T6EZRsiyggc.U5vsOsbh6ZdTjuz31E8X9meb60spRbCJ_WZyCLZylNT.Lsg3RcjOomZsFstKpvBL0S6A9MrL_LSdsHa8",
//         },
//     });
  
//     await client.connect();
  
//     // Execute a query
//     const rs = await client.execute("SELECT * FROM test.tester");
//     console.log(`Your cluster returned ${rs.rowLength} row(s)`);
//     console.log(`${rs.rows[0].userid}`)

//     // const result = await client.execute(`INSERT INTO messages.msg (id, channel, msg, sender) VALUES (62164333, 1, 'thi is test', 'nancy')`)

//     const res = await client.execute("SELECT * FROM messages.msg");
//     console.log(`Your cluster returned ${res.rowLength} row(s)`);

    
//     for (var i = res.rowLength-1; i >= 0; i--) {
//         data = {
//             id: res.rows[i].id.low,
//             channel: res.rows[i].channel,
//             msg: res.rows[i].msg,
//             sender: res.rows[i].sender,
//         };
//         console.log(data)
//     }
    
    
  
//     await client.shutdown();
//   }
  
//   // Run the async function
//   run();

const client = new Client({
    cloud: {
      secureConnectBundle: "secure-connect-gcp2021.zip",
    },
    credentials: {
      username: "rcFJnnqsLaHNDwRnRhYCXshG",
      password: "MBOX2yJLSg96JgWrsom8ThkYlGp8GyioTKe7T6EZRsiyggc.U5vsOsbh6ZdTjuz31E8X9meb60spRbCJ_WZyCLZylNT.Lsg3RcjOomZsFstKpvBL0S6A9MrL_LSdsHa8",
    },
});

client.connect();

// Execute a query
const rs = client.execute("SELECT * FROM test.tester");
console.log(`Your cluster returned ${rs.rowLength} row(s)`);
console.log(`${rs.rows[0].userid}`)

// const result = await client.execute(`INSERT INTO messages.msg (id, channel, msg, sender) VALUES (62164333, 1, 'thi is test', 'nancy')`)

const res = client.execute("SELECT * FROM messages.msg");
console.log(`Your cluster returned ${res.rowLength} row(s)`);


for (var i = res.rowLength-1; i >= 0; i--) {
    data = {
        id: res.rows[i].id.low,
        channel: res.rows[i].channel,
        msg: res.rows[i].msg,
        sender: res.rows[i].sender,
    };
    console.log(data)
}



client.shutdown();