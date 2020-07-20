require('dotenv').config();
const express = require('express');
const server = express();
const http = require('http').createServer(server);
const cors = require('cors');
const db = require('./data/db.js');
const userRoute = require('./routes/userRoutes.js');
const mongoose = require('mongoose');
const io = require('socket.io')(http);
const players = {};
const sockets = {};
const games = {};

const port = 5000;

server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000', credentials: true }));

mongoose.Promise = global.Promise;

db
    .connectTo()
    .then(() => console.log(`\n Connected to Database`))
    .catch(err => console.error(`\n Error connecting to Database \n`, err));

const logger = (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const { path } = req;
    const timeStamp = Date.now();
    const log = { path, userAgent, timeStamp };
    const stringLog = JSON.stringify(log);
    console.log(stringLog);
    next();
}
const sendUserError = (status, message, res) => {
    res.status(status).json({ error: message})
}
const originalBoard = [
    {bonus: 'WSx3'}, {}, {}, {bonus: 'LSx2'}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {bonus: 'WSx3'},
    {}, {}, {bonus: 'WSx2'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {bonus: 'WSx2'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {bonus: 'LSx2'}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {}, {}, {},
    {}, {}, {}, {bonus: 'LSx3'}, {bonus:'LSx3'}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx2'}, {}, {},
    {}, {}, {}, {bonus: 'LSx3'}, {}, {}, {}, {}, {}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx2'}, {}, {},
    {bonus: 'WSx3'}, {}, {bonus: 'LSx3'}, {}, {}, {}, {}, {}, {}, {}, {bonus:'LSx2'}, {bonus: 'LSx2'}, {}, {}, {bonus: 'WSx3'},
].map((tile, index) => { return {...tile, index }});

server.get('/', logger, (req, res) => {
    res.send('Server is up')
})
io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('connected', { "id": socket.id, board: socket.board });
    socket.on('submit_move', (board) => {
        if (Object.is(board, originalBoard)) {

        }
        socket.board = board;
        io.emit('boardState', { "board": board, "id": socket.id});
        socket.broadcast.emit('connected', {
            board: socket.board
        })
    })
    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })
})
server.use('/auth', logger, userRoute);

http.listen(port, () => console.log(`Server is listening on ${port}`))
