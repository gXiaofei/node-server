// server

const http = require('http')
const serverHandle = require('../app')
const PORT = 8899

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
    console.log(`listening on ${PORT} port`);
})