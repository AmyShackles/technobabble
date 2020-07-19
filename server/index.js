require('dotenv').config();
const express = require('express');
const server = express();
const http = require('http').createServer(server);
const cors = require('cors');
const io = require('socket.io')(http)

const port = 5000;

server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const logger = (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const { path } = req;
    const timeStamp = Date.now();
    const log = { path, userAgent, timeStamp };
    const stringLog = JSON.stringify(log);
    console.log(stringLog);
    next();
}
server.get('/', logger, (req, res) => {
    res.send('Server is up')
})
io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('submit_move', (board) => {
        console.log('move submitted');
        console.log(board);
        socket.emit('boardState', board)
    })
    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })
})
http.listen(port, () => console.log(`Server is listening on ${port}`))
