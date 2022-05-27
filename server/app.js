const mongoose = require("mongoose");
const Document = require("./Document");

require('dotenv').config()

const { Socket } = require("socket.io");

const defaultValue = "";
mongoose
    .connect(process.env.MONGOURI_STAGING_PRODUCTION, {
        dbName: "TextEditor",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    });

//http://localhost:3000

const io = require("socket.io")(3001, {
    cors: {
        origin: "*",
        method: ['GET', 'POST']
    }
});

io.on("connection", socket => {
    socket.on("get-document", async documentId => {
        const document = await findOrCreate(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

async function findOrCreate(id) {
    if (id == null) return;
    const document = await Document.findById(id);
    if (document) return document;
    return Document.create({ _id: id, data: defaultValue })
}