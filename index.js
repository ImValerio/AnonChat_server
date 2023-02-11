const app = require("express")();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.pluralize(null);

require('dotenv').config()
const {db,chatSchema} = require("./db/DBConnection");
const {getMessage, addMessage, removeCollection} = require("./utils")

app.use(morgan("tiny"));
app.use(cors());


const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});



const PORT = process.env.PORT || 5000;

const messages = [];


io.on('connection', (socket) => {
    console.log(`Entra utente => ${socket.id}`);
    let currentRoom;
    socket.on("room-join", async (room)=>{
        room = room.toString();
        await socket.join(room);
        currentRoom = room
        const roomMessages = await getMessages(room);
        socket.emit("chat-update", roomMessages)

    })

    socket.on('message', async ({message,room}) => {
        const messageToSend = {username: socket.id, msg: message}
        const roomMessages = await addMessage(room.toString(),messageToSend);
        await socket.to(room).emit("chat-update", roomMessages)
    });

    socket.on('disconnecting', () => {
        if(io.sockets.adapter.rooms.get(currentRoom) && Array.from(io.sockets.adapter.rooms.get(currentRoom)).length == 1){
            removeCollection(currentRoom);
        }
 
    });
});

http.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})

