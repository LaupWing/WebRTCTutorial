const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)

const rooms = {}

io.on("connection", socket=>{
   socket.on("join room", roomId =>{
      if(rooms[roomId]){
         rooms[roomId].push(socket.id)
      }else{
         roomId[roomId] = [socket.id]
      }
      const otherUser = rooms[roomId].find(id=>id!==socket.id)
      if(otherUser){
         socket.emit('other user', otherUser)
         socket.to(otherUser).emit('user joined', socket.id)
      }
   })

   socket.on('offer', payload =>{
      io.to(payload.target).emit('offer', payload)
   })
   socket.on('answer', payload =>{
      io.to(payload.target).emit('answer', payload)
   })
   socket.on('ice-canditate', incoming =>{
      io.to(incoming.target).emit('ice-canditate', incoming.canditate)
   })
})


server.listen(8000, ()=> console.log('Server is listening to port 8000'))