const app = require("express")();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require('dotenv').config()
const {db,chatSchema} = require("./DBConnection");

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
    socket.on("room-join", async (room)=>{
        socket.join(room);
        
        const roomMessages = await getMessages(room);
        socket.emit("chat-update", roomMessages)

    })

    socket.on('message', async ({message,room}) => {
        console.log(`${socket.id} => ${message} [${room}]`);
        const messageToSend = {username: socket.id, msg: message}
        console.log(messageToSend);
        const roomMessages = await addMessage(room,messageToSend);
        socket.to(room).emit("chat-update", roomMessages)
    });

    socket.on('disconnect', () => {
        console.log(`Esce utente => ${socket.id}`);
    });
});

http.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})

const getMessages = async (room)=>{
    const roomDB = mongoose.model(room.toString(), chatSchema);
    const data = await roomDB.find({});
    return data;
}


const addMessage = async (room,message)=>{
    console.log(room+"",message);
    const MessageObj = mongoose.model(room.toString(), chatSchema);
    const messageDB =  new MessageObj(message);
    await messageDB.save(messageDB);
    const data = await getMessages(room)
    return data;
}