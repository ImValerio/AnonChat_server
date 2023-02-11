const getMessages = async (room)=>{
    const roomDB = mongoose.model(room.toString(), chatSchema);
    const data = await roomDB.find({});
    return data;
}


const addMessage = async (room,message)=>{
    console.log(room,message);
    const MessageObj = mongoose.model(room, chatSchema);
    const messageDB =  new MessageObj(message);
    await messageDB.save(messageDB);
    const data = await getMessages(room)
    return data;
}

const removeCollection = async (colName)=>{
    const dbModel = mongoose.model(colName, chatSchema);
    await dbModel.collection.drop();
    console.log(`${colName} collection removed!`);
}

module.exports = {getMessages, addMessage, removeCollection}