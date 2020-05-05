// const http = require('http')

// const hostname = '127.0.0.1'
// const port = 3999;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200
//   res.setHeader('Content-Type', 'text/plain')
//   res.end('Hello World!\n')
// })

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`)
// })

var request = require('request');
var http = require('http');
var fs = require('fs');

http.createServer(function(req,res)
{
    var x = request('http://www.youtube.com/embed/XGSy3_Czz8k')
    req.pipe(x)
    x.pipe(res)
}).listen(1337, '127.0.0.1');