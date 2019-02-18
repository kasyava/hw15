const express = require("express");
const app = express();


const expressWs = require('express-ws')(app);
const cors = require("cors");


const PORT = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const activeConnections = [];
const paintPossition = [];


app.ws('/chat', function (ws) {

    console.log('Websocket is started');
    activeConnections.push(ws);
    const activeConnectionIndex = activeConnections.length - 1;


    for(let i=0; i<paintPossition.length; i++){
        ws.send(JSON.stringify(paintPossition[i]));
    }

    ws.on('close', () => {
        console.log('Client disconnected' + " " + activeConnectionIndex);
        activeConnections.splice(activeConnectionIndex, 1);
    });


    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg);
        paintPossition.push(decodedMessage);
        activeConnections.forEach(connection => {
            connection.send(JSON.stringify(decodedMessage));
        });
    });
});
app.listen(PORT, () => console.log(`Server started on ${PORT} port`));