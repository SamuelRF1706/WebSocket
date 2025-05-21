import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const chat = []; 
let count = 0;

app.get('/votos', (req, res) => {
    res.json({cantidad: count})
});


const port = 5001;
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});



io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on('mensaje:server', (msg) =>{
        console.log(msg);
        chat.push(msg)

        io.emit('chat:client', chat) 
 
    })

    socket.on('cuente', (data) => {
        count ++;
        console.log(count);
        io.emit('cantidadVeces', count)

        //logica pra el guardado a la base de datos
    })


    
});



server.listen(port, () => {
    console.log(`servidor corriendo en el http://localhost:${port}`);
});



















































// const personas = []

// app.get('/', (req, res)=>{
//     res.send('Hola mundo desde express')
// })

// app.get('/papu', (req, res)=>{
//     res.json({
//         nombre: 'papu',
//         edad: 20,
//         pais: 'Colombia'
//     })
// })

// app.get('/papu/:edad', (req, res)=>{
//     const { edad } = req.params
//     res.json({
//         nombre: 'papu',
//         edad: edad,
//         pais: 'Colombia'
//     })
// })

// app.get('/nombres/:nombre', (req, res)=>{
//     const { nombre } = req.params
//     personas.push(nombre)
//     res.json({data: personas}) 
// })

// app.listen(port, () => {
//     console.log(`servidor corriendo en el http://localhost:${port}`);
// });