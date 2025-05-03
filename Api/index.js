import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

const app = express();
const chat = [];
let count = 0;

app.use(cors());
app.use(morgan("dev"));

const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });

  socket.on("cuente", (socket) => {
    count++;
    socket.on("mensaje:server", (msg) => {
      console.log(msg);
      chat.push(msg);

      io.emit("chat:client", chat);
    });
  });
});

server.listen(PORT, () => {
  console.log(
    `Servidor API y WebSocket escuchando en http://localhost:${PORT}`
  );
});
